import * as React from "react";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { GameComponent } from "phaser-react-tools";
import { IonPhaser } from "@ion-phaser/react";
import config from "./config";

import { useWindowSize } from "@react-hook/window-size/throttled";
import events from "./events";
import { useEventEmitter, useEventListener } from "phaser-react-tools";
import { MetamaskWatchers } from "./MetamaskWatchers";
import Head from "next/head";
import { css } from "@emotion/react";
type Props = {};

const GameRootWrapper = styled.div`
    position: relative;
`;

export default function GameRoot({}: Props) {
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
        <GameRootWrapper
            id="game"
            css={css`
                canvas {
                    border: 1px solid #666;
                    @media (min-width: 800px) {
                        margin-top: 50px !important;
                    }
                }
            `}
        >
            <IonPhaser ref={gameRef} game={config} initialize={initialize} />

            {/* <GameComponent config={config}>
        <GameWatchers />
        <MetamaskWatchers />
      </GameComponent> */}
        </GameRootWrapper>
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
