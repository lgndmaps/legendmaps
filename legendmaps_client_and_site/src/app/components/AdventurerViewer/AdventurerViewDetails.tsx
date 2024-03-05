import { IAdventurerD } from "../../../types/adventurerTypes";
import styled from "styled-components";
import { breakpoints, palette } from "../../../styles/styleUtils";
import { ReactNode, useContext, useEffect, useState } from "react";
import { getArtRarity, getStatRarityString, getTraitDetails, getTraitRarity } from "../../../util/adventurers";
import { DescriptionEditor } from "./DescriptionEdit";
import { RootStoreContext } from "../../../stores/with-root-store";
import { observer } from "mobx-react-lite";
import { css } from "@emotion/react";
import AgilityIcon from "../../../assets/images/icon_agility.svg";
import ArtIcon from "../../../assets/images/icon_art.svg";
import BagsIcon from "../../../assets/images/icon_bags.svg";
import BrawnIcon from "../../../assets/images/icon_brawn.svg";
import GuileIcon from "../../../assets/images/icon_guile.svg";
import SpiritIcon from "../../../assets/images/icon_spirit.svg";
import Image from "next/image";
import Button from "../ui/Button";

export type AdventurerViewDetailsProps = {
    data: IAdventurerD;
};

export const AdventurerViewDetails = observer(({ data }: AdventurerViewDetailsProps) => {
    const [brawnRarity, setBrawnRarity] = useState<ReactNode>(null);
    const [agilityRarity, setAgilityRarity] = useState<ReactNode>(null);
    const [guileRarity, setGuileRarity] = useState<ReactNode>(null);
    const [spiritRarity, setSpiritRarity] = useState<ReactNode>(null);
    const { adventurersStore, accountStore } = useContext(RootStoreContext);
    const [isOwner, setIsOwner] = useState<boolean>(false);
    const [showFullLore, setShowFullLore] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);

    const checkOwner = async () => {
        setIsOwner(data.owner.toLowerCase() === accountStore.user?.publicAddress?.toLowerCase());

    };
    useEffect(() => {
        checkOwner();
    }, [accountStore.user?.publicAddress]);
    useEffect(() => {
        if (data) {
            setBrawnRarity(getStatRarityString(data.brawn, "brawn"));
            setAgilityRarity(getStatRarityString(data.agility, "agility"));
            setGuileRarity(getStatRarityString(data.guile, "guile"));
            setSpiritRarity(getStatRarityString(data.spirit, "spirit"));
        }
    }, [data]);

    return (
        <AdventurerDetailsWrapper>
            <StatsWrapper>
                <div className="title">
                    <p>ATTRIBUTES</p>
                </div>
                <div className="individual-stats">
                    <div className="brawn stat">
                        <div className="stat-title">
                            <p>Brawn</p>
                        </div>
                        <div className="stat-value">
                            {" "}
                            <div className="stat-icon">
                                <Image src={BrawnIcon.src} width={BrawnIcon.width} height={BrawnIcon.height} />
                            </div>
                            <p>{data.brawn}</p>
                        </div>
                        <div className="stat-rarity">
                            <p>{brawnRarity}</p>
                        </div>
                    </div>
                    <div className="agility stat">
                        <div className="stat-title">
                            <p>Agility</p>
                        </div>
                        <div className="stat-value">
                            {" "}
                            <div className="stat-icon">
                                <Image src={AgilityIcon.src} width={AgilityIcon.width} height={AgilityIcon.height} />
                            </div>
                            <p>{data.agility}</p>
                        </div>
                        <div className="stat-rarity">
                            <p>{agilityRarity}</p>
                        </div>
                    </div>
                    <div className="guile stat">
                        <div className="stat-title">
                            <p>Guile</p>
                        </div>
                        <div className="stat-value">
                            {" "}
                            <div className="stat-icon">
                                <Image src={GuileIcon.src} width={GuileIcon.width} height={GuileIcon.height} />
                            </div>
                            <p>{data.guile}</p>
                        </div>
                        <div className="stat-rarity">
                            <p>{guileRarity}</p>
                        </div>
                    </div>
                    <div className="spirit stat">
                        <div className="stat-title">
                            <p>Spirit</p>
                        </div>
                        <div className="stat-value">
                            {" "}
                            <div className="stat-icon">
                                <Image src={SpiritIcon.src} width={SpiritIcon.width} height={SpiritIcon.height} />
                            </div>
                            <p>{data.spirit}</p>
                        </div>
                        <div className="stat-rarity">
                            <p>{spiritRarity}</p>
                        </div>
                    </div>
                </div>
                <div className="stats-total">
                    <div className="stat-title">
                        <p>B.A.G.S Total</p>
                    </div>
                    <div className="stat-value">
                        {" "}
                        <div className="stat-icon">
                            <Image src={BagsIcon.src} width={BagsIcon.width} height={BagsIcon.height} />
                        </div>
                        <p>{data.bags_total}</p>
                    </div>
                    <div className="stat-rarity">
                        <p>{getStatRarityString(data.bags_total, "total")}</p>
                    </div>
                </div>
            </StatsWrapper>
            <DetailsWrapper>

                {data.tokenId < 10000 ? (

                    <span>
                        {(data.description_version || isOwner) && (
                            <DetailWrapper>
                                <div className="title">BIOGRAPHY</div>
                                {isOwner && data.blacklisted && (
                                    <div
                                        css={css`
                                            padding: 15px 15px 0;
                                            color: #858585;
                                        `}
                                    >
                                        This adventurer cannot be edited at this time. Please contact the team on
                                        discord to have this restriction lifted.
                                    </div>
                                )}
                                {(isOwner && !data.blacklisted && isEditing) || !data.description_version ? (
                                    <DescriptionEditor
                                        tokenId={data.tokenId}
                                        description={data.lore?.description || ""}
                                    />
                                ) : (
                                    <>
                                        <div
                                            css={css`
                                                padding: 15px 15px 0;
                                                color: #858585;
                                            `}
                                        >
                                            (written by{" "}
                                            {data?.lore?.authorAddressOrEns?.length > 25
                                                ? `${data.lore.authorAddressOrEns.substring(0, 25)}...`
                                                : data.lore.authorAddressOrEns}
                                            )
                                        </div>
                                        <div
                                            css={css`
                                                margin: 15px;
                                                max-height: ${showFullLore ? "100%" : "130px"};
                                                overflow: hidden;
                                                text-overflow: ellipsis;
                                                position: relative;
                                                word-break: break-word;
                                                position: relative;
                                            `}
                                        >
                                            <div dangerouslySetInnerHTML={{ __html: data.lore?.description }} />
                                            {!showFullLore && (
                                                <div
                                                    className="bottom-overlay"
                                                    css={css`
                                                        position: absolute;
                                                        bottom: 0;
                                                        left: 0;
                                                        width: 100%;
                                                        height: 30px;
                                                        background: linear-gradient(to bottom, transparent, #000);
                                                    `}
                                                />
                                            )}
                                        </div>
                                        <span
                                            css={css`
                                                cursor: pointer;
                                                padding: 15px;
                                                margin-left: auto;
                                                text-align: right;
                                                color: #858585;
                                                display: block;
                                            `}
                                            onClick={() => {
                                                setShowFullLore(!showFullLore);
                                            }}
                                        >
                                            {showFullLore ? `Show Less -` : `Read More +`}
                                        </span>
                                    </>
                                )}
                                {isOwner && data.description_version && (
                                    <Button
                                        css={css`
                                            margin: 0 20px 20px;
                                        `}
                                        onClick={() => setIsEditing(!isEditing)}
                                    >
                                        {!isEditing ? "Edit" : "Leave Editing"}
                                    </Button>
                                )}
                            </DetailWrapper>
                        )}
                    </span>
                ) : (
                    <span></span>
                )}

                <DetailWrapper>
                    <div className="title">RECORDS</div>
                    <div className="traits">
                        {data.total_count == null || data.total_count == 0 ? (
                            <div className="trait">
                                <div className="trait-title">
                                    <p>No adventures recorded</p>
                                </div>
                                <div className="trait-details">
                                    <div className="description"></div>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div className="trait">
                                    <div className="trait-title">
                                        <p>Run History:</p>
                                    </div>
                                    <div className="trait-details">
                                        <div className="description">
                                            <p>
                                                Campaigns Completed: <em>~coming soon~</em>
                                            </p>
                                            <p>Total Runs: {data.total_count}</p>
                                            <p>
                                                Maps Escaped: {data.total_count - data.died_count} (
                                                {Math.round(
                                                    100 * ((data.total_count - data.died_count) / data.total_count),
                                                )}
                                                % survival rate)
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="trait">
                                    <div className="trait-title">
                                        <p>Action Stats:</p>
                                    </div>
                                    <div className="trait-details">
                                        <div className="description">
                                            <p>Dwellers Killed: {data.dwellers_killed}</p>
                                            <p>Story Events Completed: {data.events_completed}</p>
                                            <p>Potions Quaffed: {data.potions_drunk}</p>
                                            <p>Items Found: {data.items_looted}</p>
                                            <p>Items Purchased: {data.items_purchased}</p>
                                            <p>Gold Looted: {data.gold_looted}</p>
                                            <p>Chests Opened: {data.chests_opened}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="trait">
                                    <div className="trait-title">
                                        <p>Top Causes of Death:</p>
                                    </div>
                                    <div className="trait-details">
                                        <div className="description">
                                            <p>
                                                {data.causesOfDeath.map((cause) => (
                                                    <div key={cause.causeOfDeath}>
                                                        {cause.causeOfDeath} ({cause.count} deaths) <br />
                                                    </div>
                                                ))}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </DetailWrapper>

                <DetailWrapper>
                    <div className="title">TRAITS</div>
                    <div className="traits">
                        {data.traits.map((trait) => {
                            return (
                                <div className="trait">
                                    <div className="trait-title">
                                        <p>{trait}</p>
                                    </div>
                                    <div className="trait-details">
                                        <div className="description">
                                            <p>{getTraitDetails(trait)}</p>
                                        </div>
                                        <div className="rarity">
                                            <p>{getTraitRarity(trait)}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </DetailWrapper>

                {data.tokenId < 10000 ? (
                    <span>
                        <DetailWrapper>
                            <div className="title">ART</div>
                            <div className="art-items">
                                {data.art_head && (
                                    <div className="art">
                                        <div className="art-title">
                                            <p>Art Head:</p>
                                        </div>
                                        <div className="art-details">
                                            <div className="description">
                                                <p>{data.art_head}</p>
                                            </div>
                                            <div className="rarity">
                                                <p>{getArtRarity(data.art_head)}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {data.art_armor && (
                                    <div className="art">
                                        <div className="art-title">
                                            <p>Art Armor:</p>
                                        </div>
                                        <div className="art-details">
                                            <div className="description">
                                                <p>{data.art_armor}</p>
                                            </div>
                                            <div className="rarity">
                                                <p>{getArtRarity(data.art_armor)}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {data.art_weapon && (
                                    <div className="art">
                                        <div className="art-title">
                                            <p>Art Weapon:</p>
                                        </div>
                                        <div className="art-details">
                                            <div className="description">
                                                <p>{data.art_weapon}</p>
                                            </div>
                                            <div className="rarity">
                                                <p>{getArtRarity(data.art_weapon)}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {data.art_shield && (
                                    <div className="art">
                                        <div className="art-title">
                                            <p>Art Shield:</p>
                                        </div>
                                        <div className="art-details">
                                            <div className="description">
                                                <p>{data.art_shield}</p>
                                            </div>
                                            <div className="rarity">
                                                <p>{getArtRarity(data.art_shield)}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {data.art_gear && (
                                    <div className="art">
                                        <div className="art-title">
                                            <p>Art Gear:</p>
                                        </div>
                                        <div className="art-details">
                                            <div className="description">
                                                <p>{data.art_gear}</p>
                                            </div>
                                            <div className="rarity">
                                                <p>{getArtRarity(data.art_gear)}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {data.art_special && (
                                    <div className="art">
                                        <div className="art-title">
                                            <p>Art Special:</p>
                                        </div>
                                        <div className="art-details">
                                            <div className="description">
                                                <p>{data.art_special}</p>
                                            </div>
                                            <div className="rarity">
                                                <p>{getArtRarity(data.art_special)}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {data.art_background && (
                                    <div className="art">
                                        <div className="art-title">
                                            <p>Background:</p>
                                        </div>
                                        <div className="art-details">
                                            <div className="description">
                                                <p>{data.art_background}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="art-total ">
                                <div className="art-title">
                                    <p>Art Rarity Rank</p>
                                </div>
                                <div className="art-total-value">
                                    {" "}
                                    <div className="stat-icon">
                                        <Image src={ArtIcon.src} width={ArtIcon.width} height={ArtIcon.height} />
                                    </div>
                                    <p>{data.art_rarity} of 8787</p>
                                </div>
                                <div className="art-rarity-info">
                                    <p>*Art Rarity Calculated from combined rarity of all art elements.</p>
                                </div>
                            </div>
                        </DetailWrapper>
                    </span>
                ) : (
                    <span></span>
                )}
            </DetailsWrapper>
        </AdventurerDetailsWrapper>
    );
});

const AdventurerDetailsWrapper = styled.div`
    display: flex;
    align-items: flex-start;
    flex-grow: 1;

    .stat-icon {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 100%;
    }

    @media (max-width: ${breakpoints.tabletSmall}) {
        margin-top: 15px;
    }
    @media (max-width: ${breakpoints.mobile}) {
        flex-wrap: wrap;
    }

    .title {
        color: #000;
        font-weight: 700;
        text-align: center;
        background: ${palette.primary.yellow};
        padding: 10px;
        width: 100%;
    }

    .traits {
        .trait {
            padding: 15px;

            &-title {
                font-weight: 700;
            }

            &-details {
                padding-left: 15px;
            }

            &:not(:last-child) {
                border-bottom: 1px dashed ${palette.primary.yellow};
            }
        }
    }

    .art-items {
        display: flex;
        flex-wrap: wrap;

        .art {
            width: 50%;

            padding: 15px;

            &-title {
                font-weight: 700;
            }

            &-details {
                padding-left: 15px;
            }

            border-bottom: 1px dashed ${palette.primary.yellow};

            &:nth-child(even) {
                border-right: none;
            }

            &:nth-child(odd) {
                &:last-child {
                    width: 100%;
                    border-right: none;
                }

                border-right: 1px dashed ${palette.primary.yellow};
            }

            @media (max-width: ${breakpoints.laptop}) {
                width: 100%;
                border-right: none !important;
            }
        }
    }

    .art-total {
        padding: 15px;

        .art {
            &-title {
                font-weight: 700;
                text-align: center;
                margin-bottom: 15px;
            }

            &-total-value {
                text-align: center;
                font-size: 24px;
                font-weight: 700;
                position: relative;
                padding-bottom: 8px;
            }

            &-rarity-info {
                color: #858585;
                text-align: center;
                font-size: 16px;
                margin-top: 15px;
            }
        }
    }
`;

const StatsWrapper = styled.div`
    min-width: 270px;

    margin-right: 30px;
    @media (max-width: ${breakpoints.mobile}) {
        width: 100%;
        margin-right: 0;
        margin-bottom: 15px;
    }
    border: 1px solid ${palette.primary.yellow};

    .stat-title {
        font-weight: 600;
    }

    .individual-stats {
        padding: 15px;
        display: flex;
        flex-wrap: wrap;
    }

    .stat {
        padding: 15px;
        width: 50%;
        text-align: center;

        &-value {
            font-size: 30px;
            font-weight: 600;
            position: relative;
            height: 100px;
            display: flex;
            align-items: center;
            justify-content: center;
            padding-bottom: 15px;
        }

        &-rarity {
            font-size: 16px;
            font-weight: 600;
        }
    }

    .stats-total {
        padding: 15px;
        width: 100%;
        text-align: center;
        border-top: 1px dashed ${palette.primary.yellow};
        position: relative;
    }
`;

const DetailsWrapper = styled.div`
    flex-grow: 1;
    display: flex;
    flex-direction: column;
`;

const DetailWrapper = styled.div`
    width: 100%;
    margin-bottom: 30px;
    border: 1px solid ${palette.primary.yellow};
`;
