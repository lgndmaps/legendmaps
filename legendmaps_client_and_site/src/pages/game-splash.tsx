import React, { useEffect, useState } from "react";
import Title from "../app/components/ui/Title";
import styled from "styled-components";
import Button from "../app/components/ui/Button";
import Tabs from "../app/components/ui/TabNav";
// import { gameTabs } from "../constants/gameContstatns";
import { RightSideBar, StyledPageContainer } from "../app/components/GlobalLayout/layout";
import { Paragraph } from "../app/components/GlobalLayout/layout";
import GddComponent from "../app/components/Game/GddComponent";
import { GAME_TAB_KEYS, GAME_TAB_TITLES } from "../constants/gameConstants";
import { ITab } from "../types/tabTypes";
import TechnicalArchitecture from "../app/components/Game/TechnicalArchitecture";
import LoginComponent from "../app/components/GlobalLayout/LoginComponent";
import GameView from "../app/components/Game/GameView";
import { useRootStore } from "../store";
import { observer } from "mobx-react-lite";
import Router from "next/router";
import { NextPage, NextPageContext } from "next";
import { getUserServerSide } from "../util/api/ServerSideApi";
import { AdminOnly } from "../app/components/Game/AdminOnly";

// Keeping this inscase we bring it back
// const gameTabs: ITab[] = [
//   {
//     key: GAME_TAB_KEYS.GAME_DESIGN_DOCUMENT,
//     label: GAME_TAB_TITLES.GAME_DESIGN_DOCUMENT,
//     component: <GddComponent title={GAME_TAB_TITLES.GAME_DESIGN_DOCUMENT} />,
//   },
//   {
//     key: GAME_TAB_KEYS.TECHNICAL_ARCHITECTURE,
//     label: GAME_TAB_TITLES.TECHNICAL_ARCHITECTURE,
//     component: <TechnicalArchitecture title={GAME_TAB_TITLES.TECHNICAL_ARCHITECTURE} />,
//   },
//   {
//     key: GAME_TAB_KEYS.CLOSED_BETA,
//     label: GAME_TAB_TITLES.CLOSED_BETA,
//     component: <TechnicalArchitecture title={GAME_TAB_TITLES.CLOSED_BETA} />,
//   },
// ];

const GameContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

type GamePageProps = {
    ctx?: NextPageContext;
};

const game: NextPage<GamePageProps> = observer(({ ctx }) => {
    const {
        accountStore: {
            user,
            initialLoadAttempted,
            featureFlags: { devMode },
        },
        gameStore,
    } = useRootStore();

    useEffect(() => {
        gameStore.isDebugGame = true;
    }, []);

    return (
        <StyledPageContainer>
            <GameContainer>
                <AdminOnly>
                    <div>
                        {initialLoadAttempted && (
                            <>
                                {!user && <LoginComponent />}
                                {user && <GameView />}
                            </>
                        )}
                    </div>
                </AdminOnly>
            </GameContainer>
        </StyledPageContainer>
    );
});

game.getInitialProps = async (ctx) => {
    const account = await getUserServerSide();

    return {};
};

export default game;
