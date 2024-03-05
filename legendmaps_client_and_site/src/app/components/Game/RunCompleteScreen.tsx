import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import styled from "styled-components";
import { useRootStore } from "../../../store";
import Title from "../ui/Title";
import { css } from "@emotion/react";
import Button from "../ui/Button";
import { StatRun } from "../../../game/types/globalTypes";
export const RunCompleteScreen = observer(() => {
    const {
        accountStore: {
            user,
            featureFlags: { devMode },
        },
        gameStore: { setActiveGameScreen, completeCampaign, activeCampaign, continueCampaign },
    } = useRootStore();
    const campaign = activeCampaign?.campaign;
    if (!campaign) {
        return <>Campaign Not Found</>;
    }
    const runInfo = campaign.campaignRunStats?.[campaign.runNumber] as StatRun | null;
    if (!runInfo) {
        return <>Run Info Not Found</>;
    }
    return (
        <div
            css={css`
                padding: 40px;
            `}
        >
            {campaign.runNumber < campaign.campaignLength - 1 ? (
                <Title text="Dungeon Run Completed" />
            ) : (
                <Title text="Campaign Victory!" />
            )}

            <DetailsWrapper>
                <p>
                    You have emerged from the dungeon intact.
                    <br />
                    Map completed in {runInfo.turns} turns.
                    <br />
                    You killed {runInfo.dwellersKilled.length} dwellers.
                    <br />
                    <br />
                    Gold looted: {runInfo.goldLooted}
                    <br /> <br />
                </p>

                {campaign.runNumber < campaign.campaignLength - 1 ? (
                    <>
                        <Button
                            onClick={() => {
                                continueCampaign();
                            }}
                        >
                            Continue Campaign
                        </Button>
                        <Button onClick={() => completeCampaign()}>End Campaign</Button>
                    </>
                ) : (
                    <Button onClick={() => completeCampaign()}>End Campaign</Button>
                )}
            </DetailsWrapper>
        </div>
    );
});

const DetailsWrapper = styled.div``;
