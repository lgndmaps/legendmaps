import settings from "../../../settings";
import {IMapD} from "../../../types/mapTypes";
import {IMapMetaD} from "../../../types/metaMapTypes";
import Skull from "../../../assets/images/skull.png";
import {css} from "@emotion/react";
import Button from "../ui/Button";

export interface MapThumbnailProps {
    map: IMapD;
    mapMeta: IMapMetaD;
    onViewDetails: (map: IMapD) => void;
    onSelect: (map: IMapD) => void;
}

const MapThumbnail = ({map, mapMeta, onViewDetails, onSelect}: MapThumbnailProps) => {
    return (
        <div
            className="map-thumbnail"
            css={css`
              margin: 0 10px;
              width: calc(33.333333% - 20px);
              align-items: flex-start;
              display: flex;
              flex-direction: column;

              .skull-row {
                display: flex;
              }

              .maptitle {
                text-align: center;
                padding: 0;
                margin: 0;
                font-size: 1rem;
                min-height: 60px;
              }

              .skull-icon {
                opacity: 0.25;

                img {
                  margin-bottom: 0;
                  width: 20px;
                  margin-right: 5px;
                }

                &.active {
                  opacity: 1;
                }
              }
            `}
        >
            <div
                css={css`
                  img {
                    margin-bottom: 0;
                  }
                `}
            >
                <div className="title">
                    <h2 className="maptitle">{map.name}</h2>
                </div>
                <div
                    css={css`
                      display: flex;
                      align-items: center;
                      margin-bottom: 20px;
                    `}
                >
                    <h3
                        css={css`
                          font-size: 20px;
                          font-weight: 400;
                        `}
                    >
                        Challenge Rating{" "}
                    </h3>
                    <div
                        className="stats__value skull-row"
                        css={css`
                          margin-left: 10px;
                        `}
                    >
                        {[...Array(5)].map((e, i) => {
                            return (
                                <div
                                    className={`skull-icon ${
                                        i <= Math.round(map.challengeRating / 2) - 1 ? "active" : ""
                                    }`}
                                >
                                    <img src={Skull.src} alt="skull"/>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <img src={`${settings.IMAGE_URL}${map.image.substring(7).split('/')[1]}`} alt={map.name}/>
            </div>
            <div
                className="buttons-row"
                css={css`
                  display: flex;
                  justify-content: flex-end;
                  width: 100%;

                  button {
                    margin-left: 5px;
                  }
                `}
            >
                <Button onClick={() => onViewDetails(map)}>Details</Button>
                <Button onClick={() => onSelect(map)}>Select</Button>
            </div>
        </div>
    );
};

export default MapThumbnail;
