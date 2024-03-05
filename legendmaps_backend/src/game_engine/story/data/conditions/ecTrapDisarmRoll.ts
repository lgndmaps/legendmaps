import StoryEvent from "../../storyEvent";
import Game from "../../../game";
import StoryEventCondition from "../storyEventCondition";
import GlobalConst from "../../../types/globalConst";
import MathUtil from "../../../utils/mathUtil";
import RandomUtil from "../../../utils/randomUtil";

export default class TrapDisarmRoll extends StoryEventCondition {
    attribute: GlobalConst.ATTRIBUTES;
    baseChance: number = 40; //between 1 and 100
    bonusPerPointOver11: number = 5;
    penaltyPerPointUnder11: number = 5;

    constructor(baseChance?: number, attribute?: GlobalConst.ATTRIBUTES) {
        super();
        this.baseChance = baseChance;
        this.attribute = attribute;
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

        return MathUtil.clamp(bonus, -100, 100);
    }

    override GetDescription(game: Game, storyEvent: StoryEvent): string {
        let bonusAmount: number = this.calculateBonus(game);
        let totalChance: number = this.baseChance + bonusAmount;
        let traitBonus: number = 0;
        let traitBonusDescription: string = "";
        if (game.dungeon.character.traitIds.includes(22)) {
            traitBonus = 35;
            traitBonusDescription = ", +30% from Trapper trait";
        }

        if (game.dungeon.character.skillIds.includes(18)) {
            traitBonus += 30;
            traitBonusDescription += ", +30% from Wererat's cunning";
        }

        totalChance += traitBonus;
        totalChance = MathUtil.clamp(totalChance, 5, 99);
        let desc: string = "";
        desc += totalChance + "% chance";
        if (bonusAmount != 0) {
            desc +=
                ", with " +
                (bonusAmount > 0 ? "+" : "") +
                bonusAmount +
                "%" +
                // (bonusAmount >= 0 ? "bonus" : "penalty") +
                " from ";

            if (this.attribute) desc += this.attribute + " & ";
            desc += "luck";
            desc += traitBonusDescription;
        }

        if (game.dungeon.character.traitIds.includes(23)) {
            desc += " [Tinkerer: chance to find a potion]";
        }
        return desc;
    }

    override Check(game: Game): boolean {
        let traitBonus: number = 0;
        if (game.dungeon.character.traitIds.includes(22)) {
            traitBonus = 30;
        }

        let chance: number = this.baseChance + this.calculateBonus(game) + traitBonus;
        chance = MathUtil.clamp(chance, 5, 99);
        return RandomUtil.instance.int(1, 100) <= chance ? true : false;
    }
}
