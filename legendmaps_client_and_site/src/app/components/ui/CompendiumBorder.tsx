import styled from "styled-components";
import { css } from "@emotion/react";

export const CompendiumBorder = () => {
    return (
        <div
            css={css`
                width: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                position: relative;
                height: 27px;
                &:before {
                    content: "";
                    display: block;
                    position: absolute;
                    width: 100%;
                    top: 12px;
                    background: #868686;
                    height: 3px;
                }
            `}
        >
            <BorderImage>
                <img src="/images/border-center.png" />
            </BorderImage>
        </div>
    );
};

const BorderImage = styled.div`
    background: #000;
    height: 27px;
    z-index: 1;
    img {
        margin-bottom: 0;
    }
`;
