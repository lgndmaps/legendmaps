import {IAdventurerD} from "../../../types/adventurerTypes";
import React from "react";
import {useRouter} from "next/router";
import styled from "styled-components";
import {breakpoints, palette} from "../../../styles/styleUtils";
import {AdventurerViewImageMeta} from "./AdventurerViewImageMeta";
import {AdventurerViewDetails} from "./AdventurerViewDetails";

export type AdventurerViewComponentProps = {
    adventurerData: IAdventurerD;
};

const AdventurerViewWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 40px;
  @media (max-width: ${breakpoints.tablet}) {
    padding: 0 10px;
  }
  flex-wrap: wrap;

  .image-container,
  .data.container {
    width: calc(50% - 20px);
    @media (max-width: ${breakpoints.tablet}) {
      width: 100%;
      margin-bottom: 20px;
    }
  }

  .back-to-adventurers {
    width: 100%;
    margin-bottom: 15px;
    cursor: pointer;
    color: ${palette.primary.gray};
  }

  .title-container {
    display: flex;
    margin-bottom: 15px;
  }

  .title-token-id {
    font-size: 18px;
    color: #000;
    padding: 10px;
    font-weight: 700;
    margin-right: 10px;
    background: ${palette.primary.yellow};
    max-height: 47px;
  }

  .title-name {
    font-size: 30px;
    font-weight: 700;
  }

  .adventurer-body-container {
    width: 100%;
    display: flex;
    align-items: flex-start;
    @media (max-width: ${breakpoints.tabletSmall}) {
      flex-wrap: wrap;
    }
  }
`;

export const AdventurerViewComponent = ({adventurerData}: AdventurerViewComponentProps) => {
    const router = useRouter();

    return (
        <AdventurerViewWrapper>
            <div onClick={() => router.push("/adventurers")} className="back-to-adventurers">
                {"< Back to Adventurers"}
            </div>
            <div className="title-container">
                <div className="title-token-id">
                    <p>{adventurerData.tokenId > 9999 ? <span>[Visiting Adventurer] </span> :
                        <span>#{adventurerData.tokenId}</span>}</p>
                </div>
                <div className="title-name">
                    <p>{adventurerData.name}</p>
                </div>
            </div>
            <div className="adventurer-body-container">
                <AdventurerViewImageMeta data={adventurerData}/>

                <AdventurerViewDetails data={adventurerData}/>
            </div>
        </AdventurerViewWrapper>
    );
};
