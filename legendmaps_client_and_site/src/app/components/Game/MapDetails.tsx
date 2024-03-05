import styled from "styled-components";
import { breakpoints, palette } from "../../../styles/styleUtils";
import { IMapMetaD } from "../../../types/metaMapTypes";
import Button from "../ui/Button";
import { useRouter } from "next/dist/client/router";
import Skull from "../../../assets/images/skull.png";
import { IMapD } from "../../../types/mapTypes";
export type MapViewDetailsProps = {
    mapInfo: IMapD;
    mapDetails: IMapMetaD;
};

const typeToString = {
    lineart: "Line Art",
    roomcount: "Rooms",
    wall: "Walls",
    biome: "Biome",
    glitch: "Glitch",
};

const MapDetailsWrapper = styled.div`
    text-align: left;
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

    .separator {
        border-bottom: 2px dashed ${palette.primary.gray};
        width: 100%;
        margin: 15px 0;
        padding: 0;
    }

    .maptitle {
        padding: 0;
        margin: 0;
        font-size: 1rem;
        min-height: 60px;
    }

    .stats {
        display: flex;
        flex-wrap: wrap;
        font-size: 0.6rem;
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
            display: flex;
            color: ${palette.primary.gray};
            span {
                padding-left: 10px;
            }
        }

        &__imptvalue {
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

const MapViewDetails = ({ mapInfo: mapJson, mapDetails: mapMeta }: MapViewDetailsProps) => {
    const items = mapMeta.items.filter((item) => item.type !== "treasure");

    const treasure = mapMeta.items.filter((item) => item.type === "treasure");
    return (
        <MapDetailsWrapper>
            <div className="title">
                <h2 className="maptitle">{mapJson.name}</h2>
            </div>
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
            </div>
        </MapDetailsWrapper>
    );
};

export default MapViewDetails;
