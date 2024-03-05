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

const DynamicGameSplashRoot = dynamic(() => import("./gamesplash/GameSplashRoot"), {
    ssr: false,
});

const Splash = observer((): JSX.Element => {
    const token = Cookies.get(USER_COOKIES.LM_JWT);
    //const { accountSettings } = useRootStore();
    const {
        accountStore: { user },
        gameStore,
    } = useRootStore();

    return (
        <>
            <DynamicGameSplashRoot />
        </>
    );
});

export default Splash;
