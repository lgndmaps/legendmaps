import React from "react";
import styled from "styled-components";
import Image from "next/image";
import Dragon from "../../../assets/dragon.png";
import {breakpoints} from "../../../styles/styleUtils";
import {css} from "@emotion/react";

interface IProps {
    text: string;
    size?: string;
    center?: boolean;
}

const mobileSizing = "5vw";

const TitleContainer = styled.div<{ size: string }>`
  display: flex;
  margin: 8px 0px 0px 0px;
  padding: 0px;

  h1.title {
    font-size: ${({size}) => size};
    letter-spacing: 0.5px;
    white-space: nowrap;
    @media (max-width: ${breakpoints.mobile}) {
      font-size: ${mobileSizing};
    }
  }
`;

const DragonContainer = styled.div<{ size: string }>`
  position: relative;
  height: ${({size}) => size};
  width: ${({size}) => size};
  @media (max-width: ${breakpoints.mobile}) {
    height: ${mobileSizing};
    width: ${mobileSizing};
  }
  transform: scale(1.2);

  &.right {
    transform: scale(-1.2, 1.2);
    margin-left: 9px;
    margin-bottom: 0px;
  }

  &.left {
    margin-right: 15px;
    margin-bottom: 0px;
  }
`;

const Title = ({text, size = "2.25rem", center = false}: IProps) => {
    return (
        <TitleContainer
            size={size}
            css={css`
              ${center && "justify-content: center;"}
            `}
        >
            <DragonImage faceing="left" size={size}/>
            <h1 className="title">{text}</h1>
            <DragonImage faceing="right" size={size}/>
        </TitleContainer>
    );
};

export default Title;

interface IDragonProps {
    faceing: "right" | "left";
    size: string;
}

const DragonImage = ({faceing, size}: IDragonProps) => (
    <DragonContainer size={size} className={faceing}>
        <Image src={Dragon} layout="fill" objectFit="contain" alt="Adventurer Preview"/>
    </DragonContainer>
);
