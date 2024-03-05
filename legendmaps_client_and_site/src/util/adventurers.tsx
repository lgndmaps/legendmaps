import { BAGS_RARITY, FULL_TRAIT_DETAILS, TRAIT_RARITY } from "../constants/adventurerConstants";
import { art, IAdventurerD } from "../types/adventurerTypes";
import { css } from "@emotion/react";
import { palette } from "../styles/styleUtils";
export const getStatRarityString = (value: number, stat: "brawn" | "agility" | "guile" | "spirit" | "total") => {
    const info = BAGS_RARITY[stat].find((stat) => stat.value === value);
    if (info?.percentage) {
        const basePercentile = 100 - info.percentile * 100;
        let percentile = Math.ceil(100 - info.percentile * 100);
        if (percentile > 50) {
            return (
                <div
                    css={css`
                        color: #333;
                    `}
                >
                    common
                </div>
            );
        }
        let roundedNum = Math.round(percentile / 5) * 5;
        if (basePercentile < 10) {
            roundedNum = percentile;
        }
        if (basePercentile < 1) {
            roundedNum = Math.ceil(basePercentile * 10) / 10;
        }
        const color =
            roundedNum < 10
                ? palette.secondary.legendary
                : roundedNum < 25
                ? palette.secondary.epic
                : roundedNum < 35
                ? palette.secondary.rare
                : roundedNum < 45
                ? palette.secondary.common
                : palette.secondary.uncommon;
        return (
            <div
                css={css`
                    color: ${color};
                `}
            >{`[top ${roundedNum}%]`}</div>
        );
    } else {
        return ``;
    }
};

export const getTraitRarity = (trait: string) => {
    const info = TRAIT_RARITY.find((stat) => stat.name === trait);
    if (info?.percentage) {
        const percentage = Math.ceil(info.percentage * 100);
        const color =
            percentage < 3
                ? palette.secondary.legendary
                : percentage < 5
                ? palette.secondary.epic
                : percentage < 10
                ? palette.secondary.rare
                : percentage < 25
                ? palette.secondary.common
                : palette.secondary.uncommon;
        return (
            <div
                css={css`
                    color: ${color};
                `}
            >{`${percentage}% of adventurers`}</div>
        );
    } else {
        return ``;
    }
};

export const getArtRarity = (art_string: string) => {
    const info = art.find((stat) => stat.name === art_string);
    if (info?.percentage) {
        const percentage = Math.ceil(info.percentage * 100);
        const color =
            percentage < 3
                ? palette.secondary.legendary
                : percentage < 5
                ? palette.secondary.epic
                : percentage < 10
                ? palette.secondary.rare
                : percentage < 25
                ? palette.secondary.common
                : palette.secondary.uncommon;
        return (
            <div
                css={css`
                    color: ${color};
                `}
            >{`${percentage}% of adventurers`}</div>
        );
    } else {
        return ``;
    }
};

export const getTraitDetails = (trait: string) => {
    const traitD = FULL_TRAIT_DETAILS.find((t) => t.trait === trait);
    return traitD.desc;
};
