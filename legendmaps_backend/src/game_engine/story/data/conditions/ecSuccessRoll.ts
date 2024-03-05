import StoryEvent from "../../storyEvent";
import Game from "../../../game";
import StoryEventCondition from "../storyEventCondition";
import GlobalConst from "../../../types/globalConst";
import MathUtil from "../../../utils/mathUtil";
import RandomUtil from "../../../utils/randomUtil";
import GameUtil from "../../../utils/gameUtil";
import SkillBonus from "./SkillBonus";
import TraitBonus from "./TraitBonus";

export default class SuccessRoll extends StoryEventCondition {
    attribute: GlobalConst.ATTRIBUTES;
    baseChance: number = 40; //between 1 and 100
    bonusPerPointOver11: number = 5;
    penaltyPerPointUnder11: number = 5;
    skillBonuses: SkillBonus[] = [];
    traitBonuses: TraitBonus[] = [];

    constructor(baseChance?: number, attribute?: GlobalConst.ATTRIBUTES) {
        super();
        this.baseChance = baseChance;
        this.attribute = attribute;
    }

    public AddSkillBonus(skillId: number, bonus: number) {
        this.skillBonuses.push(new SkillBonus(skillId, bonus));
    }

    public AddTraitBonus(traitId: number, bonus: number) {
        this.traitBonuses.push(new TraitBonus(traitId, bonus));
    }

    private calculateBonus(game: Game): number {
        let att: number;
        if (this.attribute) {
            att = game.dungeon.character.GetAttributeByType(this.attribute);
        } else {
            att = 11; // if no attribute is specified, it's just a straight % chance
        }
        let bonus: number = 0;
        if (att > 11) {
            bonus = this.bonusPerPointOver11 * (att - 11);
        } else if (att < 11) {
            bonus = this.penaltyPerPointUnder11 * (att - 11);
        }
        bonus += game.dungeon.character.luck;

        // Skill check - Bubble Eyes' Charm id 34
        if (game.dungeon.character.skillIds.includes(34)) {
            const skill = GameUtil.GetSkillById(34);
            bonus += skill.modifiers.custom;
        }

        for (let i = 0; i < this.skillBonuses.length; i++) {
            const skillBonus = this.skillBonuses[i];
            if (game.dungeon.character.skillIds.includes(skillBonus.skillId)) {
                bonus += skillBonus.bonus;
            }
        }

        for (let i = 0; i < this.traitBonuses.length; i++) {
            const traitBonus = this.traitBonuses[i];
            if (game.dungeon.character.traitIds.includes(traitBonus.traitId)) {
                bonus += traitBonus.bonus;
            }
        }
        return MathUtil.clamp(bonus, -100, 100);
    }

    override GetDescription(game: Game, storyEvent: StoryEvent): string {
        let bonusAmount: number = this.calculateBonus(game);
        let totalChance: number = MathUtil.clamp(this.baseChance + bonusAmount, 5, 100);
        let desc: string = "";
        desc += "Success: " + totalChance + "% (" + this.baseChance + "% base";
        if (bonusAmount != 0) {
            desc += " " + (bonusAmount > 0 ? "+" : "") + bonusAmount + "% from ";

            // Skill check - Bubble Eyes' Charm id 34
            if (game.dungeon.character.skillIds.includes(34)) {
                const skill = GameUtil.GetSkillById(34);
                desc += skill.name + ", ";
            }

            for (let i = 0; i < this.skillBonuses.length; i++) {
                if (game.dungeon.character.skillIds.includes(this.skillBonuses[i].skillId)) {
                    desc += this.skillBonuses[i].GetSkillName(game) + ", ";
                }
            }

            for (let i = 0; i < this.traitBonuses.length; i++) {
                if (game.dungeon.character.traitIds.includes(this.traitBonuses[i].traitId)) {
                    desc += this.traitBonuses[i].GetTraitName(game) + ", ";
                }
            }

            if (this.attribute) desc += this.attribute + " & ";
            desc += "luck)";
        } else {
            desc += ")";
        }
        return desc;
    }

    override Check(game: Game): boolean {
        let chance: number = MathUtil.clamp(this.baseChance + this.calculateBonus(game), 5, 100);
        return RandomUtil.instance.int(1, 100) <= chance ? true : false;
    }
}
