import { css } from "@emotion/react";

export type LoadingOverlayProps = {
    loadingMessage?: string;
};

export const LoadingOverlay = ({ loadingMessage = "Loading..." }: LoadingOverlayProps) => {
    return (
        <div
            css={css`
                position: fixed;
                width: 100vw;
                height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;
                left: 0;
                top: 0;
                z-index: 100000;
            `}
        >
            <div
                css={css`
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    opacity: 0.75;
                    background: #000;
                `}
            />
            <span
                css={css`
                    position: relative;
                    z-index: 1;
                `}
            >
                {loadingMessage}
            </span>
        </div>
    );
};
