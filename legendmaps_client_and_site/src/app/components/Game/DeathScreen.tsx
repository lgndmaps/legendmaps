import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import styled from "styled-components";
import { useRootStore } from "../../../store";
import Title from "../ui/Title";
import { css } from "@emotion/react";
import Button from "../ui/Button";
import { StatCampaign, StatPlayerDeath, StatRun } from "../../../game/types/globalTypes";
export const DeathScreen = observer(() => {
    const {
        accountStore: {
            user,
            featureFlags: { devMode },
        },
        gameStore: { setActiveGameScreen, completeCampaign, activeCampaign },
    } = useRootStore();
    const campaign = activeCampaign?.campaign;

    if (!campaign) {
        return <></>;
    }

    const deathInfo = campaign.campaignRunStats?.[campaign.runNumber] as (StatRun & { death?: StatPlayerDeath }) | null;
    if (!deathInfo.death) {
        return <>Run Info Not Found</>;
    }
    return (
        <div
            css={css`
                padding: 40px;
            `}
        >
            <Title text="You Died" />
            <DetailsWrapper>
                <p>
                    Killed by {deathInfo.death.killerName}.
                    <br />
                    You survived {deathInfo.turns} turns.
                    <br />
                    You killed {deathInfo.dwellersKilled.length} dwellers.
                    <br />
                    Epitaph: {deathInfo.death.epitaph}
                    <br />
                    <br />
                    Gold looted: {deathInfo.goldLooted}
                    <br /> <br />
                </p>
                <Button
                    onClick={() => {
                        completeCampaign();
                    }}
                >
                    End Campaign
                </Button>
            </DetailsWrapper>
        </div>
    );
});

const DetailsWrapper = styled.div``;
