import styled from "styled-components";
import { breakpoints, palette } from "../../../styles/styleUtils";
import { IMapMetaD } from "../../../types/metaMapTypes";
import Button from "../ui/Button";
import { useRouter } from "next/dist/client/router";
import Skull from "../../../assets/images/skull.png";
import { IMapD } from "../../../types/mapTypes";
import MapViewImage from "../MapViewer/MapViewImage";
import MapViewDetails from "../MapViewer/MapViewDetails";
import { IAdventurerD } from "../../../types/adventurerTypes";
import settings from "../../../settings";
import { css } from "@emotion/react";
import TraitData from "../../../game/util/traitData.json";

export type AdventurerDetailsModalProps = {
    adventurer: IAdventurerD;
    onSelect: () => void;
    onReturn: () => void;
};

const typeToString = {
    lineart: "Line Art",
    roomcount: "Rooms",
    wall: "Walls",
    biome: "Biome",
    glitch: "Glitch",
};

const AdventurerWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 30px;

    flex-wrap: wrap;
`;

const AdventurerDetailsModal = ({ adventurer, onSelect, onReturn }: AdventurerDetailsModalProps) => {
    return (
        <AdventurerWrapper>
            <div
                className="wrapper-inner"
                css={css`
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 20px;
                    border: 2px solid #e6c351;
                `}
            >
                <div className="title">
                    <h2>{adventurer.name}</h2>
                </div>
                <div
                    className="details-headshot"
                    css={css`
                        display: flex;
                    `}
                >
                    <div
                        className="headshot"
                        css={css`
                            border: 2px solid #484848;
                            width: 66.6666%;

                            img {
                                display: block;
                                width: 100%;
                                height: auto;
                                margin-bottom: 0;
                            }
                        `}
                    >
                        <img
                            src={`${settings.S3_URL}adv/p250/portrait_${adventurer.tokenId}.png`}
                            alt={adventurer.name}
                        />
                    </div>
                    <div
                        className="stats"
                        css={css`
                            width: 33.3333%;
                            padding: 20px;
                            .value {
                                padding: 10px;
                                border: 2px solid #484848;
                                font-size: 30px;
                                font-weight: bold;
                                width: 60px;
                                margin-right: 20px;
                                text-align: center;
                            }

                            & > * {
                                display: flex;
                                align-items: center;
                                margin-bottom: 30px;
                            }
                        `}
                    >
                        <div className="brawn">
                            <div className="value">{adventurer.brawn}</div>
                            <div className="name">Brawn</div>
                        </div>
                        <div className="agility">
                            <div className="value">{adventurer.agility}</div>
                            <div className="name">Agility</div>
                        </div>
                        <div className="guile">
                            <div className="value">{adventurer.guile}</div>
                            <div className="name">Guile</div>
                        </div>
                        <div className="spirit">
                            <div className="value">{adventurer.spirit}</div>
                            <div className="name">Spirit</div>
                        </div>
                    </div>
                </div>
                <div
                    className="traits"
                    css={css`
                        margin-top: 30px;
                    `}
                >
                    {adventurer.traits.map((t) => {
                        const trait = TraitData.traits.find((tr) => tr.trait === t);
                        return (
                            <div
                                className="trait"
                                css={css`
                                    margin-bottom: 20px;
                                `}
                            >
                                <div
                                    className="trait-name"
                                    css={css`
                                        font-weight: 700;
                                    `}
                                >
                                    {t}
                                </div>
                                {trait && <div className="trait-desc">{trait.desc}</div>}
                            </div>
                        );
                    })}
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
                    <Button onClick={() => onSelect()}>Select</Button>
                    <Button onClick={() => onReturn()}>Return</Button>
                </div>
                {/* <div className="image-container">
                <MapViewImage mapJson={mapJson} mapMetaJson={mapMeta} />
            </div>
            <div className="data container">
                <MapViewDetails
                    mapInfo={mapJson}
                    Adventurer={mapMeta}
                    isMapSelect={true}
                    onSelect={onSelect}
                    onReturn={onReturn}
                />
            </div> */}
            </div>
        </AdventurerWrapper>
    );
};

export default AdventurerDetailsModal;
