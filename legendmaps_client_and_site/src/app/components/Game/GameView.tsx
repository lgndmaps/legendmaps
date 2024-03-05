import { observer } from "mobx-react-lite";
import Cookies from "js-cookie";
import dynamic from "next/dynamic";
import { useAuth } from "../../hooks/useAuth";
import { useState, useEffect } from "react";
import Loader from "../GlobalLayout/Loader";
import { getGameSession, endGameSession, sendInput } from "../../../util/api/GameApi";
import { USER_COOKIES } from "../../../constants/userValues";
import Button from "../ui/Button";
import { useRootStore } from "../../../store";
import {useEventEmitter} from "phaser-react-tools";
import events from "./gamesplash/events";

const DynamicGameRoot = dynamic(() => import("../../../game/GameRoot"), {
    ssr: false,
});

const GameView = observer((): JSX.Element => {
    const token = Cookies.get(USER_COOKIES.LM_JWT);
    //const { accountSettings } = useRootStore();
    const {
        accountStore: { user },
        gameStore,
    } = useRootStore();
    const [loading, setLoading] = useState<boolean>(true);
    const [activeGame, setActiveGame] = useState<any>(null);
    const getActiveGame = async () => {
        const game = gameStore.activeSession;
        setActiveGame(game);
        setLoading(false);
    };

    useEffect(() => {

        getActiveGame();

    }, []);

    useEffect(() => {
        //accountSettings.setActiveAccount(user);
    }, [user]);

    if (loading) {
        return <Loader />;
    }


    return (
        <>
            <DynamicGameRoot />
        </>
    );
});

export default GameView;
