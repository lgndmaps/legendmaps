import React, {useEffect} from "react";
import styled from "styled-components";
import {StyledPageContainer} from "../app/components/GlobalLayout/layout";
import {useRootStore} from "../store";
import {observer} from "mobx-react-lite";
import {NextPage} from "next";
import {GameScreens} from "../app/components/Game/GameScreens";

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const game: NextPage<any> = observer(() => {
    const {
        accountStore: {
            user,
            loadingAccount,
            initialLoadAttempted,
            featureFlags: {devMode},
        },
        gameStore,
    } = useRootStore();

    useEffect(() => {
        gameStore.isDebugGame = false;
    }, []);

    const loadCampaign = async () => {
        await gameStore.loadCampaign();
    };

    useEffect(() => {
        if (initialLoadAttempted && user?.id) {
            loadCampaign();
        }
    }, [initialLoadAttempted]);
    return (
        <StyledPageContainer width={1260}>
            <GameContainer>
                {initialLoadAttempted && (
                    <>
                        <GameScreens isLoading={loadingAccount}/>
                    </>
                )}
            </GameContainer>
        </StyledPageContainer>
    );
});

export default game;
