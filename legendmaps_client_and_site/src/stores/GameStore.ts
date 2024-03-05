import { RootStore } from "./RootStore";
import { action, computed, makeObservable, observable } from "mobx";
import { SerializedCampaignResponse, SerializedCharacterD, SerializedGameSessionD } from "../game/types/models";
import {
    endCampaign,
    endRun,
    getAvailableMaps,
    getGameCampaign,
    levelUp,
    startGameSession,
    startNewCampaign,
} from "../util/api/GameApi";
import { GameFlowScreens } from "../game/types/frontendTypes";
import { IAdventurerD } from "../types/adventurerTypes";
import { IMapD } from "../types/mapTypes";
import { IMapMetaD } from "../types/metaMapTypes";
import { websocketManager } from "../game/util/websockets";
import { getMapServerSide } from "../util/api/ServerSideApi";

export class GameStore {
    private rootStore: RootStore;
    @observable activeCampaign?: SerializedCampaignResponse | null;
    @observable activeSession?: SerializedGameSessionD | null;
    @observable activeCharacter?: SerializedCharacterD | null;
    @observable activeAdventurer?: IAdventurerD | null;
    activeMapMeta?: IMapD | null;
    isDebugGame: boolean = false;
    @observable isRunEnded: boolean = false;
    @observable activeGameScreen: GameFlowScreens;
    @observable isLoading: boolean = false;
    // actions sometimes don't trigger due to mobx constraints. Increment this value to force a trigger
    @observable dataKey = 0;
    @observable startingNewCampaign = false;
    @observable startingNewSession = false;
    @observable loadingMessage: string | undefined = undefined;
    @observable selectableMaps: { mapData: IMapD; mapMeta: IMapMetaD }[] = [];
    @observable selectingSkill: boolean = false;
    @observable selectedPowerup: number | null = null;

    constructor(_rootStore: RootStore) {
        makeObservable(this);
        this.rootStore = _rootStore;

        this.activeGameScreen = "splash";
    }

    @action goToInitialLanding = async () => {
        await this.loadCampaign();
        if (this.activeGameScreen === "splash") {
            this.setActiveGameScreen("landing");
        }
    };

    @action loadCampaign = async () => {
        this.dataKey++;
        this.loadingMessage = "Loading Campaign...";
        this.isLoading = true;
        const user = this.rootStore.accountStore.user;
        const res = user?.id ? await getGameCampaign(user.id) : undefined;

        this.activeCampaign = res;

        this.setSessionFromCurrentCampaign();
        this.loadingMessage = undefined;
        this.isLoading = false;

        // if (!this.isRunEnded && !this.activeSession && this.activeCampaign) {
        //     if (this.hasPowerups) {
        //         this.setActiveGameScreen("apply powerup");
        //     } else {
        //         this.setActiveGameScreen("map select");
        //     }
        // }
    };

    @action loadAdventurersScreen = async () => {
        this.dataKey++;
        this.loadingMessage = "Loading Adventurers...";
        this.isLoading = true;
        await this.rootStore.adventurersStore.loadUserAdventurers();
        this.loadingMessage = undefined;
        this.isLoading = false;
        this.setActiveGameScreen("adventurer select");
    };

    @action createCampaign = async (adventurerId: number, powerupId: number | null) => {
        if (!this.startingNewCampaign && !this.activeCampaign) {
            this.dataKey++;
            this.loadingMessage = "Creating New Campaign...";
            this.isLoading = true;
            this.startingNewCampaign = true;
            const user = this.rootStore.accountStore.user;
            const res = user?.id ? await startNewCampaign(user.id, adventurerId, powerupId) : undefined;

            this.activeCampaign = res;
            this.setSessionFromCurrentCampaign();
            this.isLoading = false;
            this.loadingMessage = undefined;
            this.startingNewCampaign = false;
            if (this.needsLevelUp && res !== null) {
                this.setActiveGameScreen("level up");
            } else {
                this.setActiveGameScreen("map select");
            }
        }
    };

    @action selectMapForSession = async (map: IMapD) => {
        console.log("select", this.startingNewSession, this.activeSession);
        if (!this.startingNewSession && !this.activeSession) {
            this.dataKey++;
            this.loadingMessage = "Setting Up Session...";
            this.isLoading = true;
            this.startingNewCampaign = true;
            const user = this.rootStore.accountStore.user;
            const res = user?.id ? await startGameSession(user.id, map.tokenId) : undefined;

            if (res === null) {
                this.rootStore.errorStore.setErrorPopup("Could not create session");
            }
            this.activeSession = res;
            this.activeCharacter = this.activeCampaign.character;
            this.activeAdventurer = this.activeCampaign.adventurer;
            this.isLoading = false;
            this.loadingMessage = undefined;
            this.startingNewCampaign = false;
            this.setActiveGameScreen("gameplay");
        }
    };

    @action setSessionFromCurrentCampaign = async () => {
        if (this.activeCampaign) {
            this.activeSession = this.activeCampaign.gameSession?.id ? this.activeCampaign.gameSession : undefined;
            this.activeCharacter = this.activeCampaign.character;
            this.activeAdventurer = this.activeCampaign.adventurer;
            const { campaign } = this.activeCampaign;
            if (
                this.activeCampaign.campaign?.campaignRunStats?.[campaign.runNumber] &&
                this.activeCampaign.campaign.activeStep !== "map select"
            ) {
                this.isRunEnded = true;
                if (campaign.campaignRunStats[campaign.runNumber].death) {
                    this.setActiveGameScreen("death");
                } else {
                    this.setActiveGameScreen("run complete");
                }
            }
            if (this.activeSession?.sessionData?.tokenId) {
                const mapResult = await getMapServerSide(this.activeSession.sessionData.tokenId);
                this.activeMapMeta = mapResult?.mapJson;
            }
        }
    };

    @action setActiveGameScreen = async (screen: GameFlowScreens) => {
        if (screen === "gameplay") {
            await this.loadCampaign();
            await this.setSessionFromCurrentCampaign();
        }
        this.activeGameScreen = screen;
    };

    @computed get needsLevelUp() {
        return this.activeCampaign?.campaign.activeStep === "level up";
    }

    @computed get hasPowerups() {
        return false;
    }

    @action getAvailableMaps = async () => {
        this.isLoading = true;
        this.loadingMessage = "Loading Your Map Options...";
        const availableMapIds = await getAvailableMaps();
        this.selectableMaps = [];
        if (availableMapIds?.mapOptions?.length) {
            for (const map of availableMapIds.mapOptions) {
                const mapData = await this.rootStore.mapsStore.fetchSingle(map);
                if (!mapData.notFound) {
                    this.selectableMaps.push({ mapData: mapData.mapJson, mapMeta: mapData.mapMetaJson });
                } else {
                    console.error("Failed to fetch map", map);
                }
            }
        }
        this.isLoading = false;
        this.loadingMessage = undefined;
    };

    @action continueCampaign = async () => {
        if (this.activeCampaign.campaign.activeStep === "level up") {
            this.setActiveGameScreen("level up");
        }
    };

    @action completeRun = async () => {
        this.isLoading = true;
        this.loadingMessage = "Saving Run Results...";
        websocketManager.closeCallback = async () => {
            const endRunResponse = await endRun();
            if (endRunResponse.error || endRunResponse.message) {
                console.warn("TODO error screen");
            }

            try {
                const response = endRunResponse as SerializedCampaignResponse;
                if (response?.campaign.campaignRunStats[response.campaign.runNumber]?.death) {
                    this.activeCampaign = response;
                    this.setSessionFromCurrentCampaign();
                    this.setActiveGameScreen("death");

                    this.isLoading = false;
                    this.loadingMessage = undefined;
                } else {
                    if (typeof window !== "undefined") {
                        window.location.replace("/game?skipSplash=true");
                    }
                    return;
                }
            } catch (e) {
                console.log("RESPOSNE IS ", endRunResponse);
                console.warn("Error Ending Campaign", e);
            }
        };
        websocketManager.close();
    };

    @action completeCampaign = async () => {
        this.isLoading = true;
        this.loadingMessage = "Saving Campaign Results...";
        await endCampaign();
        this.clearState();
        this.isLoading = false;
        this.loadingMessage = undefined;
        this.setActiveGameScreen("alpha thank you");
    };

    @action processDeath = async () => {
        this.isLoading = true;
        this.loadingMessage = "Saving Run Results...";

        this.isLoading = false;
        this.loadingMessage = undefined;
        this.setActiveGameScreen("death");
    };

    @action clearState = () => {
        this.activeAdventurer = undefined;
        this.activeCampaign = undefined;
        this.activeCharacter = undefined;
        this.activeSession = undefined;
    };

    @action playAgain = () => {
        if (typeof window !== "undefined") {
            window.location.replace("/game?skipSplash=true");
        }
    };

    @action selectSkill = async (skillId: number) => {
        const levelUpResponse = await levelUp(skillId);
        if (levelUpResponse) {
            this.activeCampaign = levelUpResponse;
            this.setSessionFromCurrentCampaign();
            if (this.activeCampaign.campaign.activeStep === "map select") {
                this.activeGameScreen = "map select";
            } else {
                this.activeGameScreen = "landing";
            }
        }
    };

    @computed get getActiveRunComplete() {
        return "";
    }
}
