import GlobalConst from "../../types/globalConst";
import Game from "../../game";
import MathUtil from "../../utils/mathUtil";
import StoryEvent from "../../story/storyEvent";
import RandomUtil from "../../utils/randomUtil";
import { M_StoryEventOutcome, M_TurnEvent_Names } from "../../types/globalTypes";
import { DamageResult } from "../../types/types";
import FlagUtil from "../../utils/flagUtil";
import Trap from "../trap";

export default class TrapData {
    attribute: GlobalConst.ATTRIBUTES;
    baseChance: number = 15; //between 1 and 100
    bonusPerPointOver11: number = 3;
    penaltyPerPointUnder11: number = 3;
    traitObliviousAdjust: number = -25;
    traitParanoidAdjust: number = 50;
    wereRatSkillAdjust: number = 30;

    kind: GlobalConst.TRAP_TYPES; //unique key name for each
    storyevent: GlobalConst.STORY_EVENT_KEYS; //story event to trigger after reveal
    ascii: string = "_";
    titleCopy: string;
    bodyCopy: string;

    lastAvoidRoll: number = -1;

    /*
       this.addTrap("gas", "Õ", "trap_gas", RarityManger.RARE_4);
        this.addTrap("pit", "Ò", "trap_pit", RarityManger.UNCOMMON_3);
        this.addTrap("web", "Ô", "trap_web", RarityManger.RARE_4);
        this.addTrap("spiked wall", "Ó", "trap_spikedwall", RarityManger.EPIC_5);
        this.addTrap("lightning", "Ö", "trap_shock", RarityManger.LEGENDARY_6);
     */

    constructor(kind: GlobalConst.TRAP_TYPES, storyevent: GlobalConst.STORY_EVENT_KEYS) {
        this.kind = kind;
        this.storyevent = storyevent;
        this.attribute = GlobalConst.ATTRIBUTES.GUILE; //initial avoid tied to guile
    }

    Trigger(game: Game, trap: Trap) {
        //Check for traits
        //Roll if player manages to avoid
        //If no avoid, do effect & damage
        //Send title, body copy, trap type, and results to client
        //Spawn appropriate trap story event type under player's feet
    }

    protected getDamageDescriptionFromResult(damageResult: DamageResult) {
        if (FlagUtil.IsSet(damageResult.flags, GlobalConst.ATTACK_FLAGS.IMMUNE)) {
            return "You were immune to the " + damageResult.damage_type + " damage!";
        } else if (FlagUtil.IsSet(damageResult.flags, GlobalConst.ATTACK_FLAGS.RESISTED)) {
            return (
                damageResult.final_damage +
                " damage (resisted " +
                (damageResult.base_damage - damageResult.final_damage) +
                damageResult.damage_type +
                ")"
            );
        } else if (FlagUtil.IsSet(damageResult.flags, GlobalConst.ATTACK_FLAGS.VULN)) {
            return damageResult.final_damage + " damage (vulnerable to " + damageResult.damage_type + "!)";
        } else {
            return damageResult.final_damage + " damage";
        }
    }

    protected calculateBonus(game: Game): number {
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

    protected GetRollDescription(game: Game): string {
        let bonusAmount: number = this.calculateBonus(game);
        let totalChance: number = this.baseChance + bonusAmount;

        let traitEffect: string = "";
        if (game.dungeon.character.traitIds.includes(20)) {
            //oblvious
            totalChance += this.traitObliviousAdjust;
            traitEffect = "    +" + this.traitObliviousAdjust + "% oblivious trait\n";
        } else if (game.dungeon.character.traitIds.includes(50)) {
            //paranoid
            totalChance += this.traitParanoidAdjust;
            traitEffect = "    " + this.traitParanoidAdjust + "% paranoid trait\n";
        }

        if (game.dungeon.character.skillIds.includes(18)) {
            totalChance += this.wereRatSkillAdjust;
            traitEffect = "    +" + this.wereRatSkillAdjust + "% wererat's cunning\n";
        }
        totalChance = MathUtil.clamp(totalChance, 1, 99);
        let desc: string = "";
        desc += totalChance + "% chance";
        desc += "\n    " + this.baseChance + "% base chance";

        if (bonusAmount != 0) {
            desc += "\n    " + (bonusAmount > 0 ? "+" : "") + bonusAmount + "%" + " guile & luck\n";
            if (traitEffect != "") {
                desc += "" + traitEffect;
            }
        }
        desc += "";
        return desc;
    }

    protected CheckAvoid(game: Game): boolean {
        let chance: number = this.baseChance + this.calculateBonus(game);
        if (game.dungeon.character.traitIds.includes(20)) {
            //oblvious
            chance += this.traitObliviousAdjust;
        } else if (game.dungeon.character.traitIds.includes(50)) {
            //paranoid
            chance += this.traitParanoidAdjust;
        }
        if (game.dungeon.character.skillIds.includes(18)) {
            chance += this.wereRatSkillAdjust;
        }
        this.lastAvoidRoll = RandomUtil.instance.int(1, 100);
        return this.lastAvoidRoll <= MathUtil.clamp(chance, 1, 99) ? true : false;
    }
}
