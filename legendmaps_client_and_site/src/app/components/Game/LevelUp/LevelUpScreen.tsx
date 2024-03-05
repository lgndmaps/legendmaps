import { useRootStore } from "../../../../store";
import { LevelUpTitle } from "./LevelUpTitle";
import { css } from "@emotion/react";
import { AdventurerStats } from "./AdventurerStats";
import { SelectableSkills } from "./SelectableSkills";
import { CurrentSkills } from "./CurrentSkills";

export const LevelUpScreen = () => {
    const {
        accountStore: {
            user,
            featureFlags: { devMode },
        },
        gameStore,
        gameStore: { activeCharacter, activeAdventurer, selectSkill },
    } = useRootStore();

    const onSkillSelect = async (id: number) => {
        gameStore.selectingSkill = true;
        await gameStore.selectSkill(id);
        gameStore.selectingSkill = false;
    };

    return (
        <div
            css={css`
                padding: 40px 0;
            `}
        >
            <LevelUpTitle />
            <div
                css={css`
                    padding: 20px;
                    width: 100%;
                    text-align: center;
                `}
            >
                Select a new skill or trait.
            </div>
            <div
                css={css`
                    padding: 20px 0;
                    width: 100%;
                    display: flex;
                `}
            >
                <AdventurerStats character={activeCharacter} adventurer={activeAdventurer} />
                <SelectableSkills
                    skillIds={activeCharacter.data.skillOptionIds}
                    onSelect={(skillId) => onSkillSelect(skillId)}
                />
                <CurrentSkills
                    level={activeCharacter.data.level + 1 || 2}
                    skillIds={activeCharacter.data.skillIds}
                    traitIds={activeCharacter.data.traitIds}
                />
            </div>
        </div>
    );
};
