import {
    Adventurer,
    Campaign,
    CampaignRecord,
    Character,
    GameSession,
    PendingRewards,
    RewardRequests,
    RunRecord,
    User,
} from "../../models";
import { LegendMap } from "../../models/map.model";
import { LegendMapDetails } from "../../models/maps_details.model";
import {
    CharacterDataType,
    PendingRewardD,
    SerializedCampaignD,
    SerializedCharacterD,
    SerializedGameSessionD,
} from "../types/types";
import Game from "../game";
import Sequelize from "sequelize";
import { sequelize } from "../../db";
import { CharacterD, GameDataD, StatCampaign } from "../types/globalTypes";
import * as Sentry from "@sentry/node";
import {
    generateTokenContractSignature,
    getAdventurerTokenUris,
    getCCTokenUris,
    getFRWCTokenUris,
    getMapOwner,
    getMapTokenUris,
    getProvider,
    getRandomPowerup,
    getTokenOwner,
    getTokenOwnerByProject,
} from "../../utils/contractUtils";
import { BigNumber } from "ethers";
import GameUtil from "./gameUtil";
import { GlobalSkills } from "../types/globalSkills";
import { CampaignUtil } from "./campaignUtil";
import GameCharacterUtil from "../../utils/GameCharacterUtil";
import { ADVENTURER_PROJECTS } from "../../constants/adventurers";
import RandomUtil from "./randomUtil";
import GlobalConst from "../types/globalConst";

const _ = require("lodash");
const { Op } = Sequelize;

export type SerializedCampaignResponse = {
    campaign: SerializedCampaignD;
    character: SerializedCharacterD;
    adventurer?: Adventurer;
    gameSession: SerializedGameSessionD;
};

type CampaignWithAssociations = Campaign & {
    "character.id": number;
    "character.level": number;
    "character.adventurerId": number;
    "character.campaignId": number;
    "character.userId": number;
    "character.data": string;
    "game_session.id": number;
    "game_session.sessionData": string;
    "game_session.campaignId": number;
};

export class DBInterface {
    public static async fetchCharacter(dbId: string | number): Promise<Character | null> {
        const characterResult = await Character.findByPk(dbId);
        return characterResult;
    }

    public static async fetchCampaign(dbId: string | number): Promise<Campaign | null> {
        const campaignResult = await Campaign.findByPk(dbId);
        return campaignResult;
    }

    /* Campaign functions */
    public static async fetchCampaignRaw(dbId: string | number): Promise<SerializedCampaignResponse | null> {
        //TODO why is this failing when null

        const campaignResult = await Campaign.findOne({
            where: {
                id: dbId,
            },
            include: [Character, GameSession],
            raw: true,
        });

        if (!campaignResult) {
            return null;
        }

        const adventurer = await Adventurer.findByPk(campaignResult["character.adventurerId"]);
        const {
            id,
            sessionId,
            runNumber,
            mapSeeds,
            createdAt,
            updatedAt,
            userId,
            campaignLength,
            campaignRunStats,
            activeStep,
        } = campaignResult;

        const serializedCampaignResponse: SerializedCampaignResponse = {
            campaign: {
                id,
                sessionId,
                runNumber,
                mapSeeds,
                createdAt,
                updatedAt,
                userId,
                campaignLength,
                campaignRunStats,
                activeStep,
            },
            character: {
                id: campaignResult["character.id"],
                level: campaignResult["character.level"],
                adventurerId: campaignResult["character.adventurerId"],
                userId: campaignResult["character.userId"],
                campaignId: campaignResult["character.campaignId"],
                data: campaignResult["character.data"] as CharacterDataType,
            },
            gameSession: {
                id: campaignResult["game_session.id"],
                sessionData: campaignResult["game_session.sessionData"],
                campaignId: campaignResult["game_session.campaignId"],
            },
            adventurer: adventurer || undefined,
        };

        return serializedCampaignResponse;
    }

    public static async startNewCampaign(
        advTokenId: number,
        userId: number,
        powerupId: number | null,
        campaignLength?: number,
    ): Promise<SerializedCampaignResponse> {
        const advMeta: Adventurer = (await Adventurer.findOne({
            where: {
                tokenId: advTokenId,
            },
            raw: true,
        })) as Adventurer;

        let maps = [];
        const cLength = campaignLength || 1;
        for (let i = 0; i < cLength; i++) {
            const crMaps = await this.fetchRandomMapsAtCR(i + 1);
            if (crMaps && crMaps.length) {
                crMaps.forEach((map) => {
                    return maps.push(map.tokenId);
                });
            }
        }
        console.log("Maps list length = " + maps.length);
        const needsLevelUp = advMeta.traits.includes("Grizzled Veteran");
        let campaign = await Campaign.create({
            id: userId,
            runNumber: 0,
            campaignLength: cLength,
            userId,
            mapSeeds: maps,
            activeStep: needsLevelUp ? "level up" : "map select",
        });

        let charInitData: any = {
            level: 1,
            userId: userId,
            campaignId: campaign.id,
            adventurerId: advTokenId,
            data: {
                gold: -1,
                brawn: advMeta.brawn,
                agility: advMeta.agility,
                guile: advMeta.guile,
                spirit: advMeta.spirit,
                hpmax: GameCharacterUtil.CalculateBaseHP(advMeta.brawn),
                powerupId,
            },
        };

        if (needsLevelUp) {
            charInitData.data.skillOptionIds = GameUtil.GetCharacterSkillOptions(charInitData, 2);
        }

        const character = await Character.create(charInitData);
        // character.save();

        Object.assign(campaign, { characterId: character.id });
        campaign.save();
        const campaignResponse = await this.fetchCampaignRaw(campaign.id);
        return campaignResponse;
    }

    public static async concludeCampaign(id: number): Promise<void | null> {
        try {
            const { campaign, character, gameSession } = await this.fetchCampaignRaw(id);
            //@ts-ignore
            let gameData: GameDataD = gameSession.sessionData as GameDataD;
            /*
            let pc = gameData._entities.find((e) => {
                return e.cname === "Character";
            }) as M_Char;
    */
            const record = await this.fetchCampaign(id);
            const dbCharacter = await this.fetchCharacter(id);
            if (dbCharacter) {
                await dbCharacter.destroy();
            }
            if (record && campaign) {
                let runStats = campaign.campaignRunStats
                    ? Object.fromEntries(Object.entries(campaign.campaignRunStats).filter(([_, v]) => v != null))
                    : {};

                if (runStats?.[0]) {
                    const campaignRecord = await CampaignRecord.create({
                        advId: character.adventurerId,
                        died: runStats[campaign.runNumber]?.death !== undefined,
                        runNumber: campaign.runNumber,
                        campaignLength: campaign.campaignLength,
                        userId: id,
                        campaignStats: runStats,
                    });
                }
                const session = await this.fetchGameSession(id);
                if (session) {
                    await session.destroy();
                }
                return record.destroy();
            }
        } catch (e) {
            console.log(e);
            console.error("ERROR ENDING CAMPAIGN");
        }

        return null;
    }

    /* Session/run functions */

    public static async fetchGameSession(id: number): Promise<GameSession | null> {
        const gameSessionResult = await GameSession.findByPk(id);
        //  console.log("FETCH: ", gameSessionResult);
        //this.concludeGame(id);
        // gameSessionResult.destroy();
        return gameSessionResult;
    }

    public static async createGameSession(
        id: number,
        tokenId: number,
        campaignData: SerializedCampaignD,
        characterData: SerializedCharacterD,
    ): Promise<{ game: Game; gameSession: SerializedGameSessionD }> {
        const mapMeta: LegendMap & { map_details: LegendMapDetails } = (await LegendMap.findOne({
            where: {
                tokenId: tokenId,
            },
            include: LegendMapDetails,
            raw: true,
        })) as LegendMap & { map_details: LegendMapDetails };

        let mapMetaMetaJson = {};

        if (mapMeta) {
            const mapMetaMeta = mapMeta["map_detail.details"];
            if (mapMetaMeta) {
                mapMetaMetaJson = JSON.parse(mapMetaMeta);
            }
        }

        const map = await this.fetchMap(tokenId);
        if (!map) {
            throw new Error("Map not found");
        }
        const game: Game = new Game();
        const mapPowerup = await getRandomPowerup(map.owner);
        //@ts-ignore
        game.InitNewGame(tokenId, mapMeta, mapMetaMetaJson, null, campaignData, characterData, mapPowerup);
        // console.log("Calling... CASC " + JSON.stringify(characterData));
        await game.dungeon.CreateAndSpawnCharacter(characterData);

        const gameSession = await GameSession.create({
            id: id,
            sessionData: game.data.toJSON(),
            campaignId: campaignData.id,
        });

        if (campaignData.campaignRunStats?.[0] || campaignData.runNumber > 0) {
            const campaign = await Campaign.findByPk(id);
            if (campaign) {
                campaign.set({
                    runNumber: campaignData.runNumber + 1,
                });
                await campaign.save();
            }
        }
        // console.log(gameSession);
        //@ts-ignore
        return { game, gameSession };
    }

    public static async concludeGame(id: number): Promise<void | null> {
        const record = await this.fetchGameSession(id);
        if (record) {
            return record.destroy();
        }
        return null;
    }

    public static async doLevelUp(
        skillId: number,
        userId: number,
        characterId: number,
    ): Promise<SerializedCampaignResponse | null> {
        const campaign = await this.fetchCampaign(userId);
        const character = await this.fetchCharacter(characterId);

        const skill = GlobalSkills.find((s) => s.id === skillId);

        if (!character || !campaign) {
            throw new Error("character or campaign not found");
        }

        if (!skill) {
            throw new Error("invalid skill");
        }

        Object.assign(campaign, {
            activeStep: "map select",
        });

        let leveledUpCharacterData = _.cloneDeep(character.data);

        if (leveledUpCharacterData.luck == undefined) {
            leveledUpCharacterData.luck = leveledUpCharacterData._luck;
        }
        if (leveledUpCharacterData.brawn == undefined) {
            leveledUpCharacterData.brawn = leveledUpCharacterData._brawn;
        }
        if (leveledUpCharacterData.agility == undefined) {
            leveledUpCharacterData.agility = leveledUpCharacterData._agility;
        }
        if (leveledUpCharacterData.guile == undefined) {
            leveledUpCharacterData.guile = leveledUpCharacterData._guile;
        }
        if (leveledUpCharacterData.spirit == undefined) {
            leveledUpCharacterData.spirit = leveledUpCharacterData._spirit;
        }
        if (leveledUpCharacterData.hpmax == undefined) {
            leveledUpCharacterData.hpmax = leveledUpCharacterData._hpmax;
        }
        // handled as effects now in Character.ApplySkillsEffects()
        // if (skill.modifiers) {
        //     leveledUpCharacterData.brawn = leveledUpCharacterData.brawn + (skill.modifiers.brawn || 0);
        //     leveledUpCharacterData.agility = leveledUpCharacterData.agility + (skill.modifiers.agility || 0);
        //     leveledUpCharacterData.guile = leveledUpCharacterData.guile + (skill.modifiers.guile || 0);
        //     leveledUpCharacterData.spirit = leveledUpCharacterData.spirit + (skill.modifiers.spirit || 0);
        // }
        if (!leveledUpCharacterData.skillIds) {
            leveledUpCharacterData.skillIds = [];
        }
        leveledUpCharacterData.skillIds.push(skillId);

        leveledUpCharacterData.level = character.level + 1;
        leveledUpCharacterData.hpmax += GameCharacterUtil.CalculateLevelUpHP(leveledUpCharacterData.brawn);

        // Skill check Dramrock's Fortitude - id 22
        if (skillId == 22) {
            leveledUpCharacterData.hpmax += skill.modifiers.custom;
        }

        character.level = leveledUpCharacterData.level;

        Object.assign(character, {
            data: {
                ...character.data,
                skillOptionIds: null,
                brawn: leveledUpCharacterData.brawn,
                _brawn: leveledUpCharacterData.brawn,
                agility: leveledUpCharacterData.agility,
                _agility: leveledUpCharacterData.agility,
                guile: leveledUpCharacterData.guile,
                _guile: leveledUpCharacterData.guile,
                spirit: leveledUpCharacterData.spirit,
                _spirit: leveledUpCharacterData.spirit,
                hpmax: leveledUpCharacterData.hpmax,
                _hpmax: leveledUpCharacterData.hpmax,
                _hp: leveledUpCharacterData.hpmax,
                luck: leveledUpCharacterData.luck,
                _luck: leveledUpCharacterData.luck,
                level: leveledUpCharacterData.level,
                skillIds: leveledUpCharacterData.skillIds,
            },
        });

        // console.log("SAVING: " + JSON.stringify(character));
        await character.save();
        await campaign.save();

        const serializedCampaignResponse = await CampaignUtil.fetch(userId);

        if (serializedCampaignResponse) {
            return serializedCampaignResponse;
        } else {
            return null;
        }
    }

    public static async CREATE_TEST_DATA() {
        console.log("CREATING TEST DATA!!!!!!!!");
        RandomUtil.instance.setSeed(12);
        for (let i = 0; i < 100; i++) {
            let isDead: boolean = Math.random() < 0.5 ? true : false;
            let dwellersKilled = [];
            let dc = RandomUtil.instance.int(0, 12);
            for (let j = 0; j < dc; j++) {
                dwellersKilled.push(RandomUtil.instance.fromEnum(GlobalConst.DWELLER_KIND) as string);
            }

            let causeOfDeath: string = "";
            if (isDead) {
                causeOfDeath = RandomUtil.instance.fromEnum(GlobalConst.DWELLER_KIND) as string;
            }

            const runStats = await RunRecord.create({
                advId: 108,
                mapId: 5000,
                died: isDead,
                runNumber: RandomUtil.instance.int(1, 5),
                dwellersKilled: dwellersKilled,
                chestsOpened: RandomUtil.instance.int(0, 5),
                foodEaten: RandomUtil.instance.int(0, 5),
                goldLooted: RandomUtil.instance.int(0, 1000),
                itemsLooted: RandomUtil.instance.int(0, 5),
                itemsPurchased: RandomUtil.instance.int(0, 2),
                potionsDrunk: RandomUtil.instance.int(0, 3),
                scrollsRead: RandomUtil.instance.int(0, 3),
                storyEventsCompleted: RandomUtil.instance.int(0, 1),
                turns: RandomUtil.instance.int(10, 255),
                causeOfDeath: causeOfDeath,
            });

            await runStats.save();
            console.log(i + "ADDING RUN STATS: " + runStats.id);
        }
    }

    public static async concludeRun(id: number, userAddress: string): Promise<SerializedCampaignResponse | null> {
        const record = await this.fetchGameSession(id);
        const campaign = await this.fetchCampaign(id);
        const { campaign: campaignRaw, character: rawCharacter } = await this.fetchCampaignRaw(id);
        const character = await this.fetchCharacter(rawCharacter.id);
        if (!record || !campaign) {
            console.log("INVALID RECORD OR CAMPAIGN");
            throw new Error("run or campaign not found");
        }
        const characterData = record.sessionData._entities.find((e) => e.cname === "Character") as
            | CharacterD
            | undefined;

        //@ts-ignore
        const gameData = record.sessionData as GameDataD;
        const campaignRunStats = (campaign.campaignRunStats as StatCampaign) || {
            0: null,
            1: null,
            2: null,
            3: null,
            4: null,
        };
        const runNumber = campaign.runNumber;
        let runRecordId = -1;
        try {
            //Saving Run Stats
            let dwellersKilled: string[] = [];
            for (let i = 0; i < gameData.stats.dwellersKilled.length; i++) {
                const dweller = gameData.stats.dwellersKilled[i];
                dwellersKilled.push(dweller.kind);
            }

            let causeOfDeath: string = "";
            if (gameData.stats.playerDeath) {
                causeOfDeath = gameData.stats.causeOfDeath.killerName;
            }
            const runStats = await RunRecord.create({
                advId: character.adventurerId,
                mapId: gameData.stats.mapTokenId,
                died: gameData.stats.playerDeath,
                runNumber: runNumber + 1,
                dwellersKilled: dwellersKilled,
                chestsOpened: gameData.stats.chestsOpened,
                foodEaten: gameData.stats.foodEaten,
                goldLooted: gameData.stats.goldLooted,
                itemsLooted: gameData.stats.itemsLooted,
                itemsPurchased: gameData.stats.itemsPurchased,
                potionsDrunk: gameData.stats.potionsDrunk,
                scrollsRead: gameData.stats.scrollsRead,
                storyEventsCompleted: gameData.stats.storyEventsCompleted,
                turns: gameData.stats.turns,
                causeOfDeath: causeOfDeath,
            });

            await runStats.save();
            runRecordId = runStats.id;
        } catch (e) {
            console.log("error saving run stats", e);
        }

        campaign.set({
            campaignRunStats: {
                ...campaignRunStats,
                [runNumber]: {
                    ...gameData.stats,
                    death: gameData.stats.playerDeath ? gameData.stats.causeOfDeath : undefined,
                },
            },
        });

        /**
         * BEGIN REWARD HANDLING
         */
        const advOwnerAddress = userAddress;
        const adventurer = await Adventurer.findByPk(character.adventurerId);

        const map = await LegendMap.findByPk(campaign?.campaignRunStats?.[runNumber].mapTokenId);

        const mapOwnerAddress = map.owner;
        const ownerUser = await User.findOne({
            where: {
                publicAddress: {
                    [Op.iLike]: mapOwnerAddress,
                },
            },
        });

        let detailsMapHolder = "";
        let detailedAdvHolder = "";
        let sourceMapHolder: "Dungeon Victory" | "Adventurer Defeated" | "Adventurer Escaped";
        let sourceAdvHolder: "Dungeon Victory" | "Adventurer Defeated" | "Adventurer Escaped";
        let rewardMapHolder = 5;
        let rewardAdvHolder = 5;

        //reminder, CR is internally 1-10, but displayed 1-5
        let adjCR = Math.round(map.challengeRating / 2);

        if (gameData.stats.playerDeath) {
            detailsMapHolder =
                adventurer.name + " died in your map: " + map.name.trim() + ". " + gameData.stats.causeOfDeath.epitaph;
            detailedAdvHolder =
                adventurer.name + " fell in the map: " + map.name.trim() + ". " + gameData.stats.causeOfDeath.epitaph;
            sourceMapHolder = "Adventurer Defeated";
            sourceAdvHolder = "Adventurer Defeated";
            rewardMapHolder = Math.round(25 * adjCR);
            rewardAdvHolder = Math.round(5 + 10 * (adjCR - 1));
        } else {
            detailsMapHolder = adventurer.name + " completed your map: " + map.name;
            detailedAdvHolder = adventurer.name + " conquered the map: " + map.name;
            sourceAdvHolder = "Dungeon Victory";
            sourceMapHolder = "Adventurer Escaped";
            rewardMapHolder = Math.round(10 * adjCR);
            rewardAdvHolder = Math.round(10 + (25 * (adjCR - 1) + gameData.stats.goldLooted / 250));
            if (adjCR >= 5) {
                rewardAdvHolder += 100;
                detailedAdvHolder = "Campaign Victory! " + detailedAdvHolder;
            }
        }

        let mapHolderPendingReward: PendingRewardD = {
            userId: ownerUser ? ownerUser.id : null,
            userAddress: mapOwnerAddress,
            spendId: 0,
            spendAmount: 0,
            issueId: 1,
            issueAmount: rewardMapHolder,
            source: sourceMapHolder,
            sourceDetails: detailsMapHolder,
            claimed: false,
        };

        let advHolderPendingReward: PendingRewardD = {
            userId: id,
            userAddress: advOwnerAddress,
            spendId: 0,
            spendAmount: 0,
            issueId: 1,
            issueAmount: rewardAdvHolder,
            source: sourceAdvHolder,
            sourceDetails: detailedAdvHolder,
            claimed: false,
        };

        console.log("Saving Reward Info ", mapHolderPendingReward, advHolderPendingReward);
        await DBInterface.addPendingReward(mapHolderPendingReward);
        await DBInterface.addPendingReward(advHolderPendingReward);
        /**
         * END REWARD HANDLING
         */

        if (campaign?.campaignRunStats?.[runNumber]) {
            if (campaign?.campaignRunStats?.[runNumber]?.death !== undefined) {
                //Give map holder a reward
                try {
                    const map = await LegendMap.findByPk(campaign?.campaignRunStats?.[runNumber].mapTokenId);
                    if (map) {
                        const mapOwnerAddress = map.owner;

                        if (mapOwnerAddress) {
                            /*
                            const user = await User.findOne({
                                where: {
                                    publicAddress: {
                                        [Op.iLike]: mapOwnerAddress,
                                    },
                                },
                            });

                                                        DBInterface.addPendingReward({
                                                            userId: user ? user.id : null,
                                                            userAddress: mapOwnerAddress,
                                                            spendId: 0,
                                                            spendAmount: 0,
                                                            issueId: 1,
                                                            issueAmount: 1,
                                                            source: "Adventurer Defeated",
                                                            sourceDetails: "test 1",
                                                            claimed: false,
                                                            // runRecordId: runRecordId,
                                                        });
                                                        */
                        }
                    }

                    campaign.set({
                        campaignRunStats: {
                            ...campaignRunStats,
                            [runNumber]: {
                                ...gameData.stats,
                                death: gameData.stats.playerDeath ? gameData.stats.causeOfDeath : undefined,
                            },
                        },
                    });
                    campaign.set({
                        activeStep: "death",
                    });
                } catch (e) {
                    console.log("error giving map holder reward", e);
                }
            } else {
                /*
                DBInterface.addPendingReward({
                    userId: id,
                    userAddress,
                    spendId: 0,
                    spendAmount: 0,
                    issueId: 1,
                    issueAmount: 5,
                    source: "Dungeon Victory",
                    sourceDetails: "test 2",
                    claimed: false,
                    //  runRecordId: runRecordId,
                });

                 */

                campaign.set({
                    activeStep: "level up",
                });

                try {
                    if (characterData) {
                        character.set({
                            data: {
                                ...characterData,
                                skillOptionIds: GameUtil.GetCharacterSkillOptions(
                                    {
                                        ...characterData,
                                        skillIds: character.data?.skillIds || [],
                                    },
                                    character.level + 1,
                                ),
                            },
                        });
                    }
                } catch (e) {
                    console.log("character data error: " + e);
                }
            }
        }
        try {
            await campaign.save();
        } catch (e) {
            console.log("error saving campaign", e);
        }

        try {
            await character.save();
        } catch (e) {
            console.log("error saving character", e);
        }

        try {
            await record.destroy();
        } catch (e) {
            console.log("error destroying record", e);
        }
        try {
            return await this.fetchCampaignRaw(id);
        } catch (e) {
            console.log("error fetching campaign", e);
            return null;
        }
    }

    public static async writeSessionToDB(id: string, game: Game): Promise<GameSession | void> {
        const gameSession = await GameSession.findByPk(id);
        //  console.log(gameSession, game.data.toJSON());
        //TODO need a parser to convert session to a DB ready session
        Object.assign(gameSession, { sessionData: game.data.toJSON() });
        //console.log("GAME DATA " + JSON.stringify(game.data.toJSON()));
        try {
            return await gameSession?.save();
        } catch (e) {
            console.log("error saving game session", e);
        }
    }

    public static async fetchMap(id: number): Promise<LegendMap | void> {
        const map = await LegendMap.findOne({
            where: {
                tokenId: id,
            },
        });
        return map;
    }

    public static async fetchRandomMaps(): Promise<LegendMap[] | null> {
        const mapsAtCR = await LegendMap.findAll({
            where: {
                challengeRating: {
                    [Op.between]: [0, 12],
                },
            },
            order: sequelize.random(),
            limit: 3,
        });
        return mapsAtCR;
    }

    public static async fetchRandomMapsAtCR(cr: number): Promise<LegendMap[] | void> {
        const min = cr * 2 - 1;
        const max = min + 2;
        const mapsAtCR = await LegendMap.findAll({
            where: {
                challengeRating: {
                    [Op.eq]: min,
                },
            },
            order: sequelize.random(),
            limit: 1,
        });

        const mapsAtCROrP1 = await LegendMap.findAll({
            where: {
                challengeRating: {
                    [Op.between]: [min, max],
                },
            },
            order: sequelize.random(),
            limit: 2,
        });
        return mapsAtCR.concat(mapsAtCROrP1);
    }

    public static async addPendingReward(reward: PendingRewardD): Promise<PendingRewards | null> {
        const pendingReward = await PendingRewards.create(reward);
        return pendingReward;
    }

    public static async claimPendingRewards(user: User, rewards: PendingRewards[]): Promise<RewardRequests[] | null> {
        const rewardRequests: RewardRequests[] = [];

        const issueValues: Map<
            number,
            {
                spendId: number;
                spendAmount: number;
                issueAmount: number;
                consumed: PendingRewards[];
            }
        > = new Map<
            number,
            {
                spendId: number;
                spendAmount: number;
                issueAmount: number;
                consumed: PendingRewards[];
            }
        >();
        for (const reward of rewards) {
            const value = issueValues.get(reward.issueId)?.issueAmount || 0;
            const consumed = issueValues.get(reward.issueId)?.consumed || [];
            issueValues.set(reward.issueId, {
                spendId: 0,
                spendAmount: 0,
                issueAmount: value + reward.issueAmount,
                consumed: [...consumed, reward],
            });
        }
        for (let [key, value] of issueValues) {
            const rewardSignature = await generateTokenContractSignature(
                BigNumber.from(value.issueAmount),
                user.publicAddress,
                user.id,
            );
            const nonce = rewardSignature.nonce as BigNumber;

            const rewardRequest = await RewardRequests.create({
                userId: user.id,
                userAddress: user.publicAddress,
                consumedRewards: value.consumed,
                signature: rewardSignature.signature,
                nonce: nonce.toNumber(),
            });

            rewardRequests.push(rewardRequest);

            for (const pendingReward of value.consumed) {
                Object.assign(pendingReward, { claimed: true });
                await pendingReward.save();
            }
        }
        return rewardRequests;
    }

    public static async refreshOwnership(): Promise<void> {
        const provider = getProvider();
        for (let i = 0; i < 8787; i++) {
            try {
                const adventurer = await Adventurer.findByPk(i);
                if (adventurer) {
                    const owner = await getTokenOwner(provider, i);
                    if (owner) {
                        Object.assign(adventurer, { owner });
                        await adventurer.save();
                    }
                }
            } catch (e) {
                console.log(e);
            }
        }
        for (let i = 0; i < 5757; i++) {
            try {
                const map = await LegendMap.findByPk(i);
                if (map) {
                    const owner = await getMapOwner(provider, i);
                    if (owner) {
                        Object.assign(map, { owner });
                        await map.save();
                    }
                }
            } catch (e) {
                console.log(e);
            }
        }
        //crypto coven
        // for (let i = 0; i < 10000; i++) {
        //     try {
        //         const adventurer = await Adventurer.findOne({
        //             where: {
        //                 nativeTokenId: i,
        //                 project: ADVENTURER_PROJECTS.CRYPTO_COVEN,
        //             },
        //         });
        //         if (adventurer) {
        //             const owner = await getTokenOwnerByProject(ADVENTURER_PROJECTS.CRYPTO_COVEN, provider, i);
        //             if (owner) {
        //                 Object.assign(adventurer, { owner });
        //                 await adventurer.save();
        //             }
        //             console.log(`CC-${i}`);
        //         }
        //     } catch (e) {
        //         console.log(e);
        //     }
        // }
        // //frwc
        // for (let i = 0; i < 10000; i++) {
        //     try {
        //         const adventurer = await Adventurer.findOne({
        //             where: {
        //                 nativeTokenId: i,
        //                 project: ADVENTURER_PROJECTS.FORGOTTEN_RUNES_WIZARDCULT,
        //             },
        //         });
        //         if (adventurer) {
        //             const owner = await getTokenOwnerByProject(
        //                 ADVENTURER_PROJECTS.FORGOTTEN_RUNES_WIZARDCULT,
        //                 provider,
        //                 i,
        //             );
        //             if (owner) {
        //                 Object.assign(adventurer, { owner });
        //                 await adventurer.save();
        //             }
        //             console.log(`FRWC-${i}`);
        //         }
        //     } catch (e) {
        //         console.log(e);
        //     }
        // }
        console.log("Refresh complete");
    }

    public static async refreshUserOwnership(address: string): Promise<void> {
        const provider = getProvider();
        const owned = getAdventurerTokenUris(provider, address);
        const adventurers = (await owned).adventurers;
        Sentry.captureEvent({ message: "refreshing user ownership" });

        for (let i = 0; i < adventurers?.length; i++) {
            const adventurer = await Adventurer.findByPk(adventurers[i][0]);
            if (adventurer) {
                Object.assign(adventurer, { owner: address });
                await adventurer.save();
            }
        }

        const ownedMaps = getMapTokenUris(provider, address);
        const maps = (await ownedMaps).legendmaps;
        for (let i = 0; i < maps?.length; i++) {
            const map = await LegendMap.findByPk(maps[i][0]);
            if (map) {
                Object.assign(map, { owner: address });
                await map.save();
            }
        }

        //Crypto coven doesn't have a way to check this
        // const ownedWitches = getCCTokenUris(provider, address);
        // const witches = (await ownedWitches).adventurers;
        // for (let i = 0; i < witches?.length; i++) {
        //     const witch = await LegendMap.findByPk(witches[i][0]);
        //     if (witch) {
        //         Object.assign(witch, {owner: address});
        //         await witch.save();
        //     }
        // }

        const ownedWizards = getFRWCTokenUris(provider, address);
        const wizards = (await ownedWizards).adventurers;
        for (let i = 0; i < wizards?.length; i++) {
            const wizard = await LegendMap.findByPk(wizards[i][0]);
            if (wizard) {
                Object.assign(wizard, { owner: address });
                await wizard.save();
            }
        }
    }
}
