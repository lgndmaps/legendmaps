import Image from "next/image";
import styled from "styled-components";
import AgilityIcon from "../../../assets/images/icon_agility.svg";
import BrawnIcon from "../../../assets/images/icon_brawn.svg";
import GuileIcon from "../../../assets/images/icon_guile.svg";
import SpiritIcon from "../../../assets/images/icon_spirit.svg";
import { breakpoints, palette } from "../../../styles/styleUtils";

export type AdventurerStatBlockProps = {
    brawn: number;
    brawnRarity?: string;
    agility: number;
    agilityRarity?: string;
    guile: number;
    guileRarity?: string;
    spirit: number;
    spiritRarity?: string;
};

export const AdventurerStatBlock = ({
    brawn,
    brawnRarity,
    agility,
    agilityRarity,
    guile,
    guileRarity,
    spirit,
    spiritRarity,
}: AdventurerStatBlockProps) => {
    return (
        <StatsWrapper>
            <div className="individual-stats">
                <div className="brawn stat">
                    <div className="stat-title">
                        <p>Brawn</p>
                    </div>
                    <div className="stat-value">
                        {" "}
                        <div className="stat-icon">
                            <Image
                                src={BrawnIcon.src}
                                width={BrawnIcon.width * 0.85}
                                height={BrawnIcon.height * 0.85}
                            />
                        </div>
                        <p>{brawn}</p>
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
                            <Image
                                src={AgilityIcon.src}
                                width={AgilityIcon.width * 0.85}
                                height={AgilityIcon.height * 0.85}
                            />
                        </div>
                        <p>{agility}</p>
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
                            <Image
                                src={GuileIcon.src}
                                width={GuileIcon.width * 0.85}
                                height={GuileIcon.height * 0.85}
                            />
                        </div>
                        <p>{guile}</p>
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
                            <Image
                                src={SpiritIcon.src}
                                width={SpiritIcon.width * 0.85}
                                height={SpiritIcon.height * 0.85}
                            />
                        </div>
                        <p>{spirit}</p>
                    </div>
                    <div className="stat-rarity">
                        <p>{spiritRarity}</p>
                    </div>
                </div>
            </div>
        </StatsWrapper>
    );
};

const StatsWrapper = styled.div`
    min-width: 213px;
    .stat-icon {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 100%;
    }
    @media (max-width: ${breakpoints.mobile}) {
        width: 100%;
        margin-right: 0;
        margin-bottom: 15px;
    }

    .stat-title {
        font-weight: 600;
        font-size: 16px;
    }
    .individual-stats {
        padding: 15px;
        display: flex;
        flex-wrap: wrap;
    }

    .stat {
        padding: 10px 15px;
        width: 50%;
        text-align: center;

        &-value {
            font-size: 20px;
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
