import { css } from "@emotion/react";

import Image from "next/image";
import BagsIcon from "../../../../assets/images/icon_bags.svg";
import { GlobalSkills } from "../../../../game/types/globalSkills";
import { traits } from "../../../../game/util/traitData.json";

export type CurrentSkillsProps = {
    level: number;
    skillIds: number[];
    traitIds: number[];
};

export const CurrentSkills = ({ level, skillIds, traitIds }: CurrentSkillsProps) => {
    const cSkills = GlobalSkills.filter((s) => skillIds?.includes(s.id));
    const cTraits = traits.filter((s) => traitIds?.includes(s.id));
    return (
        <div
            css={css`
                width: 298px;
                display: flex;
                flex-direction: column;
                align-items: center;
                .stat-icon {
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
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
                        width: 100%;
                        p {
                            margin-bottom: -8px;
                        }
                    }
                    &-rarity {
                        font-size: 16px;
                        font-weight: 600;
                    }
                }
            `}
        >
            {" "}
            <span>Level</span>
            <div className="stat-value">
                <div className="stat-icon">
                    <Image src={BagsIcon.src} width={BagsIcon.width} height={BagsIcon.height} />
                </div>
                <p>{level}</p>
            </div>
            {(cSkills.length > 0 || cTraits.length > 0) && (
                <>
                    {" "}
                    <img
                        css={css`
                            margin-bottom: 0;
                        `}
                        src="/images/uncapped-border.png"
                    />
                    <div>
                        {cSkills.map((skill) => (
                            <div
                                css={css`
                                    display: block;
                                    margin-bottom: 20px;
                                `}
                            >
                                <span
                                    css={css`
                                        display: block;
                                        margin-bottom: 5px;
                                    `}
                                >
                                    Skill: {skill.name}
                                </span>
                                <span
                                    css={css`
                                        display: block;
                                        margin-bottom: 5px;
                                    `}
                                >
                                    {skill.description}
                                </span>
                            </div>
                        ))}
                        {cTraits.map((trait) => (
                            <div
                                css={css`
                                    display: block;
                                    margin-bottom: 20px;
                                `}
                            >
                                <span
                                    css={css`
                                        display: block;
                                        margin-bottom: 5px;
                                    `}
                                >
                                    Trait: {trait.trait}
                                </span>
                                <span
                                    css={css`
                                        display: block;
                                        margin-bottom: 5px;
                                    `}
                                >
                                    {trait.desc}
                                </span>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};
