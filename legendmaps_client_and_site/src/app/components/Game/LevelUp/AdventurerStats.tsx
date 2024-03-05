import { SerializedCharacterD } from "../../../../game/types/models";
import { IAdventurerD } from "../../../../types/adventurerTypes";
import { css } from "@emotion/react";
import settings from "../../../../settings";
import { AdventurerStatBlock } from "../../AdventurerViewer/AdventurerStatBlock";
import { GlobalSkills } from "../../../../game/types/globalSkills";

const getAdjustedStats = (adventurer: IAdventurerD, character: SerializedCharacterD) => {
    const cSkills = GlobalSkills.filter((s) => character.data.skillIds?.includes(s.id));

    let brawn = adventurer.brawn;
    if (character.data.brawn) {
        let adjustedBrawn = character.data.brawn;
        for (const skill of cSkills) {
            if (skill.modifiers.brawn) {
                adjustedBrawn += skill.modifiers.brawn;
            }
        }
        brawn = adjustedBrawn;
    }
    let agility = adventurer.agility;
    if (character.data.agility) {
        let adjustedAgility = character.data.agility;
        for (const skill of cSkills) {
            if (skill.modifiers.agility) {
                adjustedAgility += skill.modifiers.agility;
            }
        }
        agility = adjustedAgility;
    }
    let guile = adventurer.guile;
    if (character.data.guile) {
        let adjustedGuile = character.data.guile;
        for (const skill of cSkills) {
            if (skill.modifiers.guile) {
                adjustedGuile += skill.modifiers.guile;
            }
        }
        guile = adjustedGuile;
    }
    let spirit = adventurer.spirit;
    if (character.data.spirit) {
        let adjustedSpirit = character.data.spirit;
        for (const skill of cSkills) {
            if (skill.modifiers.spirit) {
                adjustedSpirit += skill.modifiers.spirit;
            }
        }
        spirit = adjustedSpirit;
    }

    return { brawn, agility, guile, spirit };
};

export type AdventuterStatProps = {
    adventurer: IAdventurerD;
    character: SerializedCharacterD;
};

export const AdventurerStats = ({ adventurer, character }: AdventuterStatProps) => {
    const { brawn, agility, guile, spirit } = getAdjustedStats(adventurer, character);
    return (
        <div
            css={css`
                display: flex;
                flex-direction: column;
                max-width: 250px;
                align-items: center;
            `}
        >
            <span
                css={css`
                    font-size: 19px;
                    font-weight: bold;
                    max-width: 213px;
                    text-align: center;
                `}
            >
                {adventurer.name}
            </span>
            <div
                className="adventurer-thumbnail__image"
                css={css`
                    max-width: 253px;
                    display: block;
                    margin: 0 auto;
                    padding: 20px 20px 0;
                    img {
                        margin-bottom: 0;
                    }
                `}
            >
                <img src={`${settings.S3_URL}adv/p250/portrait_${adventurer.tokenId}.png`} alt={adventurer.name} />
            </div>
            <AdventurerStatBlock brawn={brawn} agility={agility} guile={guile} spirit={spirit} />
        </div>
    );
};
