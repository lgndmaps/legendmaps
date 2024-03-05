import * as React from "react";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { IonPhaser } from "@ion-phaser/react";
import config from "./config";
import events from "./events";

import { useWindowSize } from "@react-hook/window-size/throttled";
import { useEventEmitter, useEventListener } from "phaser-react-tools";
import { useRootStore } from "../../../../store";

type Props = {};

const GameSplashRootWrapper = styled.div`
    position: relative;
`;

export default function GameSplashRoot({}: Props) {
    const { gameStore } = useRootStore();
    const gameRef = React.useRef(null);
    const [initialize, setInitialize] = useState<boolean>(false);
    const destroy = () => {
        if (gameRef.current) {
            gameRef.current.destroy();
        }
        setInitialize(false);
    };

    useEffect(() => {
        if (typeof window !== "undefined") {
            setInitialize(true);
        }
    }, []);
    return (
        <GameSplashRootWrapper id="game">
            <IonPhaser ref={gameRef} game={config} initialize={initialize} />
            {/* <GameComponent config={config}>
        <GameWatchers />
        <MetamaskWatchers />
      </GameComponent> */}
        </GameSplashRootWrapper>
    );
}

export function GameWatchers({}: Props) {
    const [width, height] = useWindowSize();

    const emitResize = useEventEmitter(events.ON_WINDOW_RESIZE);
    useEffect(() => {
        try {
            emitResize({ width, height });
        } catch (err) {
            // console.log("emitResize err:", err);
        }
    }, [width, height]);

    return <React.Fragment />;
}
