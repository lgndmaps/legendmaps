import {IAdventurerD} from "../../../types/adventurerTypes";
import styled from "styled-components";
import Button from "../ui/Button";
import {breakpoints, palette} from "../../../styles/styleUtils";

export type AdventurerViewImageMetaProps = {
    data: IAdventurerD;
};

export const AdventurerViewImageMeta = ({data}: AdventurerViewImageMetaProps) => {
    return (
        <ImageMetaWrapper>
            <ImageWrapper>
                <img
                    src={`https://files.legendmaps.io/adv/p/portrait_${data.tokenId}.png`}
                    alt={`${data.name} Portrait`}
                />
            </ImageWrapper>

            {data.tokenId < 9999 ?
                <span>
            <div className="other-image-links">
                <div className="title">Adventurer Images</div>
                <div className="links">
                    <Button
                        onClick={() => {
                            window.open(
                                `https://files.legendmaps.io/adv/p/portrait_${data.tokenId}.png`,
                                "_blank",
                            );
                        }}
                    >
                        Portrait
                    </Button>
                    <Button
                        onClick={() => {
                            window.open(
                                `https://files.legendmaps.io/adv/c/char_card_${data.tokenId}.png`,
                                "_blank",
                            );
                        }}
                    >
                        Character Card
                    </Button>
                    <Button
                        onClick={() => {
                            window.open(
                                `https://files.legendmaps.io/adv/t/tp_portrait_${data.tokenId}.png`,
                                "_blank",
                            );
                        }}
                    >
                        Transparent
                    </Button>
                </div>
            </div>
            <div className="other-links">
                <div className="title">Links</div>
                <div className="links">
                    <Button
                        onClick={() => {
                            window.open(
                                `https://opensea.io/assets/0xca72fecc4bdb993650654a9881f2be15a7875796/${data.tokenId}`,
                                "_blank",
                            );
                        }}
                    >
                        View on OpenSea
                    </Button>
                    <Button
                        onClick={() => {
                            window.open(
                                `https://looksrare.org/collections/0xCA72feCc4BDb993650654A9881F2Be15a7875796/${data.tokenId}`,
                                "_blank",
                            );
                        }}
                    >
                        View on LooksRare
                    </Button>
                </div>
            </div>
                    </span> : null}
        </ImageMetaWrapper>
    );
};

const ImageMetaWrapper = styled.div`
  min-width: 280px;
  max-width: 280px;
  @media (max-width: ${breakpoints.tablet}) {
    min-width: 180px;
    max-width: 180px;
  }

  margin-right: 30px;
  @media (max-width: ${breakpoints.tabletSmall}) {
    width: 100%;
    max-width: initial;
    margin-right: 0;
  }

  .title {
    font-weight: 700;
    margin-bottom: 10px;
  }

  .links {
    display: flex;
    flex-wrap: wrap;

    button {
      font-size: 16px;
      padding: 5px 10px;
      margin-right: 10px;
      margin-bottom: 10px;
    }
  }

  .other-image-links {
    margin-bottom: 30px;
  }
`;

const ImageWrapper = styled.div`
  border: 1px solid ${palette.primary.yellow};

  img {
    display: block;
    margin-bottom: 0;
  }

  margin-bottom: 20px;
`;
