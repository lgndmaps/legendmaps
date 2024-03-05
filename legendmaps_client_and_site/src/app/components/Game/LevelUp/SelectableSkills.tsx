import { css } from "@emotion/react";
import { GlobalSkills } from "../../../../game/types/globalSkills";
import { useRootStore } from "../../../../store";
import Button from "../../ui/Button";

export type SelectableSkillProps = {
    skillIds: number[];
    onSelect: (skillId: number) => void;
};

export const SelectableSkills = ({ skillIds, onSelect }: SelectableSkillProps) => {
    const cSkills = GlobalSkills.filter((s) => skillIds.includes(s.id));
    const { gameStore } = useRootStore();
    return (
        <div
            css={css`
                width: 468px;
            `}
        >
            <img
                css={css`
                    margin-bottom: 0;
                `}
                src="/images/capped-border.png"
            />
            <div>
                {cSkills.map((skill) => (
                    <div
                        css={css`
                            margin: 10px;
                            padding: 10px 20px 20px;
                            &:first-child {
                                margin-top: 0;
                            }
                            &:not(:last-child) {
                                border-bottom: 2px solid #d0b05c;
                            }
                        `}
                    >
                        <span
                            css={css`
                                font-size: 18px;
                                font-weight: bold;
                                display: block;
                                margin-bottom: 15px;
                            `}
                        >
                            {skill.name}
                        </span>
                        <span
                            css={css`
                                font-size: 15px;
                                display: block;
                                margin-bottom: 15px;
                            `}
                        >
                            {skill.description}
                        </span>
                        <Button
                            size="small"
                            css={css`
                                font-size: 16px;
                                padding: 0px 10px;
                                border-radius: 5px;
                                border-color: #fff;
                                margin-left: auto;
                            `}
                            disabled={gameStore.selectingSkill}
                            onClick={() => onSelect(skill.id)}
                        >
                            Select
                        </Button>
                    </div>
                ))}
            </div>
            <img src="/images/capped-border.png" />
        </div>
    );
};
