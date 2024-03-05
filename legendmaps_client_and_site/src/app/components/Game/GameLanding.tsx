import { observer } from "mobx-react-lite";
import styled from "styled-components";
import { useRootStore } from "../../../store";
import { endCampaign } from "../../../util/api/GameApi";
import LoginComponent from "../GlobalLayout/LoginComponent";
import Button from "../ui/Button";

export const GameLanding = observer(() => {
    const {
        accountStore: { user },
        adventurersStore,
        gameStore: {
            activeCampaign,
            activeSession,
            setActiveGameScreen,
            setSessionFromCurrentCampaign,
            hasPowerups,
            needsLevelUp,
            completeRun,
            processDeath,
            completeCampaign,
            loadAdventurersScreen,
        },
    } = useRootStore();
    if (!user) {
        return <LoginComponent />;
    }
    return (
        <div>
            <h2 style={{ letterSpacing: 0, textAlign: "center" }}>Legend Maps</h2>
            <h4 style={{ textAlign: "center" }}>beta test version 0.2.5c</h4>
            <div style={{ display: "flex" }}>
                <div>
                    Welcome to the beta for Legend Maps!
                </div>

                <div style={{ paddingLeft: 60 }}>
                    <ButtonWrapper>
                        {activeCampaign && activeSession && (
                            <>
                                <Button
                                    onClick={() => {
                                        setSessionFromCurrentCampaign();
                                        setActiveGameScreen("gameplay");
                                    }}
                                >
                                    Load Game
                                </Button>
                                {user.role === "admin" && (
                                    <Button onClick={() => endCampaign()}>End Campaign For Rewards</Button>
                                )}
                            </>
                        )}
                        {(!activeCampaign || activeCampaign == undefined) && (
                            <Button
                                onClick={() => {
                                    loadAdventurersScreen();
                                }}
                            >
                                Start Campaign
                            </Button>
                        )}

                        {activeCampaign && !activeSession && (
                            <Button
                                onClick={() => {
                                    //Todo need to check if a powerup is already applied
                                    needsLevelUp
                                        ? setActiveGameScreen("level up")
                                        : hasPowerups
                                            ? setActiveGameScreen("apply powerup")
                                            : setActiveGameScreen("map select");
                                }}
                            >
                                Start Run
                            </Button>
                        )}

                        {activeCampaign && activeSession && (
                            <Button
                                onClick={() => {
                                    completeCampaign();
                                }}
                            >
                                End Campaign
                            </Button>
                        )}

                        {user.role === "admin" && (
                            <>
                                {activeCampaign && activeSession && (
                                    <Button
                                        onClick={() => {
                                            completeRun();
                                        }}
                                    >
                                        Trigger Run End
                                    </Button>
                                )}

                                {activeCampaign && activeSession && (
                                    <Button
                                        onClick={() => {
                                            processDeath();
                                        }}
                                    >
                                        Trigger Death
                                    </Button>
                                )}

                                <Button onClick={() => adventurersStore.redeemRewards()}>Fetch Pending Rewards</Button>
                            </>
                        )}
                    </ButtonWrapper>
                </div>
            </div>
        </div>
    );
});

const ButtonWrapper = styled.div`
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  button {
    margin-bottom: 20px;
    min-width: 225px;
    font-family: alagard, monospace;
    text-rendering: optimizeLegibility;
    font-size: 20px;
  }
`;
