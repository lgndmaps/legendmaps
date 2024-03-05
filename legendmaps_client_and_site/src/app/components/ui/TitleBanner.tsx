import React from "react";
import { css } from "@emotion/css";
import styled from "styled-components";
import Image from "next/image";
import { breakpoints } from "../../../styles/styleUtils";
import DragonIcon from "../../../assets/dragon-yellow.png";

export type TitleBannerProps = {
    title: string;
};

export const TitleBanner = ({ title }: TitleBannerProps) => {
    return (
        <div
            css={css`
                position: relative;
                height: 78px;
                font-size: 53px;
                letter-spacing: 5px;
                font-family: alagard, monospace;
                text-rendering: optimizeLegibility;
                color: #d0b05c;
                display: flex;
                justify-content: center;
                align-items: center;
                &:before {
                    content: "";
                    display: block;
                    width: 50%;
                    background-size: contain;
                    background-repeat: no-repeat;
                    background-position: left middle;
                    background-image: url("/images/title-border.png");
                    position: absolute;
                    left: 0;
                    top: 50%;
                    transform: translateY(-50%);
                    height: 30px;
                }
                &:after {
                    content: "";
                    display: block;
                    width: 50%;
                    background-size: contain;
                    background-repeat: no-repeat;
                    background-position: left middle;
                    background-image: url("/images/title-border.png");
                    position: absolute;
                    right: 0;
                    top: 50%;
                    transform: translateY(-50%) rotate(180deg);
                    height: 30px;
                }
            `}
        >
            <DragonImage faceing="right" size={53} />
            <span
                css={css`
                    background: #000;
                    display: inline-block;
                    position: relative;
                    padding: 0 10px;
                    z-index: 1;
                `}
            >
                {title}
            </span>
            <DragonImage faceing="left" size={53} />
        </div>
    );
};

const mobileSizing = "5vw";

interface IDragonProps {
    faceing: "right" | "left";
    size: number;
}

const DragonImage = ({ faceing, size }: IDragonProps) => (
    <DragonContainer size={`${size + 40}px`} className={faceing}>
        <div
            css={`
                height: ${size}px;
                width: ${size}px;
                display: block;
                position: relative;
            `}
        >
            <Image src={DragonIcon} layout="fill" objectFit="contain" alt="Adventurer Preview" />
        </div>
    </DragonContainer>
);

const DragonContainer = styled.div<{ size: string }>`
    display: inline-block;
    position: relative;
    background: #000;
    padding: 0 20px;
    z-index: 1;
    height: ${({ size }) => size};
    width: ${({ size }) => size};
    display: flex;
    justify-content: center;
    align-items: center;
    @media (max-width: ${breakpoints.mobile}) {
        height: ${mobileSizing};
        width: ${mobileSizing};
    }
    transform: scale(1.2);
    &.right {
        transform: scale(-1.2, 1.2);
        margin-left: 9px;
    }
    &.left {
        margin-right: 15px;
    }
`;
