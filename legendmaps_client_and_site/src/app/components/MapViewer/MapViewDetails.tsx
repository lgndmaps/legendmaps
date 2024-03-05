import styled from "styled-components";
import {breakpoints, palette} from "../../../styles/styleUtils";
import {IMapMetaD} from "../../../types/metaMapTypes";
import Button from "../ui/Button";
import {useRouter} from "next/dist/client/router";
import Skull from "../../../assets/images/skull.png";
import {IMapD} from "../../../types/mapTypes";
import {css} from "@emotion/react";

export type MapViewDetailsProps = {
    mapInfo: IMapD;
    mapDetails: IMapMetaD;
    isMapSelect?: boolean;
    onSelect?: () => void;
    onReturn?: () => void;
};

const typeToString = {
    lineart: "Line Art",
    roomcount: "Rooms",
    wall: "Walls",
    biome: "Biome",
    glitch: "Glitch",
};

const MapDetailsWrapper = styled.div`
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

  .top-row {
    display: flex;
    align-items: center;

    .map-number {
      min-width: 100px;
      height: 40px;
      padding: 2px;
      font-size: 25px;
      font-weight: bold;
      color: #000;
      background: ${palette.primary.gray};
      text-align: center;
    }

    button {
      height: 40px;
      margin-left: auto;
      padding: 0 10px;
      font-size: 16px;
    }
  }

  .separator {
    border-bottom: 2px dashed ${palette.primary.gray};
    width: 100%;
    margin: 15px 0;
    padding: 0;
  }

  .maptitle {
    padding: 0;
    margin: 0;
  }

  .stats {
    display: flex;
    flex-wrap: wrap;

    & > * {
      width: 50%;
      @media (max-width: ${breakpoints.mobile}) {
        width: 100%;
      }
    }

    & > * {
      & > * {
        &:not(:last-child) {
          margin-bottom: 25px;
        }
      }
    }

    &__value {
      padding-left: 10px;
      display: flex;
      color: ${palette.primary.gray};

      span {
        padding-left: 10px;
      }
    }

    &__imptvalue {
      padding-left: 10px;
      display: flex;
      color: #fff;

      span {
        padding-left: 10px;
      }
    }
  }

  .skull-row {
    padding-left: 0;
  }

  .rankings {
    display: flex;
    flex-direction: column;
    padding-top: 5px;

    .ranking__value {
      padding-left: 10px;

      display: flex;
      color: ${palette.primary.gray};

      span {
        padding-left: 10px;
      }
    }

    &__title {
      padding-top: 10px;
      display: inline;
      color: #fff;
      font-weight: 800;
    }
  }
`;

const MapViewDetails = ({
                            mapInfo: mapJson,
                            mapDetails: mapMeta,
                            isMapSelect,
                            onSelect,
                            onReturn,
                        }: MapViewDetailsProps) => {
    const router = useRouter();
    const items = mapMeta.items.filter((item) => item.type !== "treasure");

    const treasure = mapMeta.items.filter((item) => item.type === "treasure");
    console.log("JSON" + JSON.stringify(mapJson));
    return (
        <MapDetailsWrapper>
            {!isMapSelect && (
                <div className="top-row">
                    <div className="map-number">#{mapJson.tokenId}</div>
                    <Button
                        onClick={() =>
                            router.push(
                                `https://opensea.io/assets/0xbff184118bf575859dc6a236e8c7c4f80dc7c25c/${mapJson.tokenId}`,
                            )
                        }
                    >
                        View on OpenSea
                    </Button>
                </div>
            )}

            <div className="separator"></div>
            <div className="title">
                <h2 className="maptitle">{mapJson.name}</h2>
            </div>
            <div className="separator"></div>

            {mapJson.total_count == null || mapJson.total_count == 0 ? (
                <div className="stats">
                    <div className="stats__global">
                        <div className="stat">
                            <div className="stats__title">Adventurer Records:</div>
                            <div className="stats__value">

                                <p>
                                    No adventures recorded.
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            ) : (
                <div className="stats">
                    <div className="stats__global">
                        <div className="stat">
                            <div className="stats__title">Adventurer Records:</div>
                            <div className="stats__value">

                                <p>
                                    {mapJson.total_count} entered, {mapJson.died_count} killed<br/>
                                    {Math.round(100 * ((mapJson.total_count - mapJson.died_count) / mapJson.total_count))}%
                                    survival rate
                                </p>

                            </div>

                        </div>

                        <div className="stat">
                            <div className="stats__title">Loot Taken:</div>
                            <div className="stats__value">
                                <p>
                                    {mapJson.gold_looted} gold looted<br/>
                                    {mapJson.items_looted} items taken<br/>
                                    {mapJson.chests_opened} chests opened <br/>
                                </p>
                            </div>

                        </div>
                    </div>

                    <div className="stats__global">
                        <div className="stat">
                            <div className="stats__title">Top Causes of Death:</div>
                            <div className="stats__value">
                                <p>
                                    {
                                        mapJson.causesOfDeath.map((cause) => (
                                            <div key={cause.causeOfDeath}>
                                                {cause.count} {cause.causeOfDeath}<br/>
                                            </div>
                                        ))
                                    }

                                </p>
                            </div>

                        </div>
                    </div>
                </div>
            )}

            <div className="separator"></div>
            <div className="stats">
                <div className="stats__global">
                    {mapMeta.globals.map((global) => {
                        if (global.type == "glitch" && global.description.indexOf("common") > -1) {
                            //skip
                        } else {
                            return (
                                <div className="stat">
                                    <div className="stats__title">{typeToString[global.type]}:</div>
                                    <div className="stats__value">
                                        <p>
                                            {global.description}
                                            {global.description.indexOf("room") == -1 && global.rarityString && (
                                                <span className={global.rarityString}>[{global.rarityString}]</span>
                                            )}
                                            {global.countPerMap > 0 && (
                                                <div>
                                                    {Math.round(10000 * (global.countPerMap / 5757)) / 100}% of maps
                                                </div>
                                            )}
                                        </p>
                                    </div>
                                </div>
                            );
                        }
                    })}

                    {mapMeta.specialRooms.map((specialRoom) => {
                        if (specialRoom.description.indexOf("none") > -1) {
                            //skip
                        } else {
                            return (
                                <div className="stat">
                                    <div className="stats__title">Special Room:</div>
                                    <div className="stats__value">
                                        <p>
                                            {specialRoom.description}
                                            {specialRoom.countPerMap > 0 && (
                                                <div>
                                                    {Math.round(10000 * (specialRoom.countPerMap / 5757)) / 100}% of
                                                    maps
                                                </div>
                                            )}
                                        </p>
                                    </div>
                                </div>
                            );
                        }
                    })}
                </div>
                <div className="stats__specific">
                    {items?.length > 0 && (
                        <div className="stat">
                            <div className="stats__title">Items:</div>

                            {items.map((item) => {
                                return (
                                    <div className="stats__value">
                                        <p>
                                            {item.description}
                                            {item.rarityString && (
                                                <span className={item.rarityString}>[{item.rarityString}]</span>
                                            )}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                    {treasure?.length > 0 && (
                        <div className="stat">
                            <div className="stats__title">Treasure:</div>

                            {treasure.map((item) => {
                                return (
                                    <div className="stats__value">
                                        <p>{item.description}</p>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                    {mapMeta?.dwellers?.length && (
                        <div className="stat">
                            <div className="stats__title">Dwellers:</div>

                            {mapMeta?.dwellers?.map((dweller) => {
                                return (
                                    <div className="stats__value">
                                        <p>
                                            {dweller.description}
                                            {dweller.rarityString && (
                                                <span className={dweller.rarityString}>[{dweller.rarityString}]</span>
                                            )}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {mapMeta?.traps?.length > 0 ? (
                        <div className="stat">
                            <div className="stats__title">Traps:</div>

                            {mapMeta?.traps?.map((trap) => {
                                return (
                                    <div className="stats__value">
                                        <p>
                                            {trap.name}
                                            {trap.rarityString && (
                                                <span className={trap.rarityString}>[{trap.rarityString}]</span>
                                            )}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="stat">
                            <div className="stats__title">Traps:</div>
                            <div className="stats__value">
                                <p>
                                    <i>none</i>
                                </p>
                            </div>
                        </div>
                    )}
                </div>
                {isMapSelect && (
                    <div
                        css={css`
                          display: flex;
                          flex-direction: column;
                          align-items: center;
                          width: 100% !important;
                          padding: 20px;

                          button {
                            margin-bottom: 20px;
                          }
                        `}
                    >
                        <div className="stats__ranks">
                            <div className="stat">
                                <div className="stats__title">Challenge Rating**:</div>
                                <div className="stats__value skull-row">
                                    {[...Array(5)].map((e, i) => {
                                        return (
                                            <div
                                                className={`skull-icon ${
                                                    i <= Math.round(mapJson.challengeRating / 2) - 1 ? "active" : ""
                                                }`}
                                            >
                                                <img src={Skull.src} alt="skull"/>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                        <div className="buttons">
                            <Button onClick={() => onSelect?.()}>Select</Button>
                            <Button onClick={() => onReturn?.()}>Return</Button>
                        </div>
                    </div>
                )}
            </div>

            {!isMapSelect && (
                <>
                    <div className="separator"></div>

                    <div className="stats">
                        <div className="stats__ranks">
                            <div className="stat">
                                <div className="stats__title">Challenge Rating**:</div>
                                <div className="stats__value skull-row">
                                    {[...Array(5)].map((e, i) => {
                                        return (
                                            <div
                                                className={`skull-icon ${
                                                    i <= Math.round(mapJson.challengeRating / 2) - 1 ? "active" : ""
                                                }`}
                                            >
                                                <img src={Skull.src} alt="skull"/>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="stat">
                                <div className="stats__title">Feature Rarity Rank*:</div>
                                <div className="stats__value">{mapJson.featureRarityRank} of 5757</div>
                            </div>
                        </div>
                        <div className="stats__ranks">
                            <div className="stat">
                                <div className="stats__title">Danger Rarity Rank*:</div>
                                <div className="stats__value">{mapJson.enemyRarityRank} of 5757</div>
                            </div>
                            <div className="stat">
                                <div className="ranking__title">Item Rarity Rank*:</div>
                                <div className="stats__value">{mapJson.itemRarityRank} of 5757</div>
                            </div>
                        </div>
                    </div>
                    <div className="rankings">
                        <div className="rankings__title">Important Note About Rarity Ranks:</div>
                        *All Legend Maps are playable. Rarity ranks are not directly gameplay relevant (individual
                        items, dwellers, and features are). Ranks are calculated from aggregate rarity as follows: Item
                        Rarity Rank (items, treasures), Danger Rarity Rank (dwellers, traps) and Feature Rarity Rank
                        (biome, walls, glitch, special rooms).
                        <div className="rankings__title">Challenge Rating:</div>
                        **Challenge ratings are SUBJECT TO CHANGE since they have a direct gameplay impact. Lower CR
                        maps are more appealing in general to lower powered Characters, higher CR for higher powered
                        ones.
                    </div>
                </>
            )}
            <div className="separator"></div>
        </MapDetailsWrapper>
    );
};

export default MapViewDetails;
