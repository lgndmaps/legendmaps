import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useRootStore } from "../../../store";
import Loader from "../GlobalLayout/Loader";
import LoginComponent from "../GlobalLayout/LoginComponent";
import { AdventurerSelect } from "./AdventurerSelect";
import { AlphaThankYou } from "./AlphaThankYou";
import { ApplyPowerup } from "./ApplyPowerup";
import { DeathScreen } from "./DeathScreen";
import { GameLanding } from "./GameLanding";
import { GameScreen } from "./GameScreen";
import GameSplashRoot from "./gamesplash/GameSplashRoot";
import GameView from "./GameView";
import { LevelUpScreen } from "./LevelUp/LevelUpScreen";
import { LoadingOverlay } from "./LoadingOverlay";
import { MapSelect } from "./MapSelect";
import { PowerupSelect } from "./PowerupSelect";
import { RunCompleteScreen } from "./RunCompleteScreen";
import Splash from "./Splash";

export type GameScreensProps = {
    isLoading: boolean;
};

export const GameScreens = observer(({ isLoading }: GameScreensProps) => {
    const {
        accountStore: {
            user,
            featureFlags: { devMode },
        },
        gameStore: {
            activeGameScreen,
            activeCampaign,
            loadingMessage,
            isLoading: gameStoreLoading,
            goToInitialLanding,
            setActiveGameScreen,
        },
    } = useRootStore();

    const { query } = useRouter();

    useEffect(() => {
        setActiveGameScreen("splash");
    }, []);

    useEffect(() => {
        if (query.skipSplash) {
            goToInitialLanding();
        }
    }, [query]);

    if (isLoading) {
        return <Loader />;
    }
    return (
        <>
            {gameStoreLoading && <LoadingOverlay loadingMessage={loadingMessage} />}
            {!user && <LoginComponent />}
            {user && activeGameScreen === "landing" && <GameLanding />}
            <GameScreen isVisible={user && activeGameScreen === "splash"}>
                <Splash />
            </GameScreen>
            <GameScreen isVisible={user && activeGameScreen === "adventurer select"}>
                <AdventurerSelect />
            </GameScreen>

            <GameScreen isVisible={user && activeGameScreen === "apply powerup"}>
                <ApplyPowerup />
            </GameScreen>

            <GameScreen isVisible={user && activeGameScreen === "map select"}>
                <MapSelect />
            </GameScreen>

            <GameScreen isVisible={user && activeGameScreen === "gameplay"}>
                <GameView />
            </GameScreen>

            <GameScreen isVisible={user && activeGameScreen === "death"}>
                <DeathScreen />
            </GameScreen>

            <GameScreen isVisible={user && activeGameScreen === "level up"}>
                <LevelUpScreen />
            </GameScreen>

            <GameScreen isVisible={user && activeGameScreen === "run complete"}>
                <RunCompleteScreen />
            </GameScreen>

            <GameScreen isVisible={user && activeGameScreen === "alpha thank you"}>
                <AlphaThankYou />
            </GameScreen>
        </>
    );
});
