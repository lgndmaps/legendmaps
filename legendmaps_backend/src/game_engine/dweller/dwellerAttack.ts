import type Game from "../game";
import DwellerAttackData from "./data/DwellerAttackData";
import GlobalConst from "../types/globalConst";
import Item from "../item/item";
import Effect from "../effect/effect";
import Dweller from "./dweller";
import EffectUtil from "../effect/effectUtil";

export default class DwellerAttack extends Item {
    $dweller: Dweller;
    $attackData: DwellerAttackData;

    constructor(game: Game, dweller: Dweller, attackData: DwellerAttackData) {
        super(game);
        this.$dweller = dweller;
        this.$attackData = attackData;
        this.name = this.$attackData.name;
        this.baseTypeDweller = attackData.baseType;
        let eff: Effect = new Effect(this.game);
        eff.type = GlobalConst.EFFECT_TYPES.DAMAGE;
        eff.source = EffectUtil.CreateSource(GlobalConst.SOURCE_TYPE.INNATE, -1);

        eff.amount_base = this.$attackData.level_damage[this.$dweller.level].min;
        eff.amount_max = this.$attackData.level_damage[this.$dweller.level].max;
        eff.trigger = GlobalConst.EFFECT_TRIGGERS.HIT;
        eff.range = 1;
        eff.damage_type = this.$attackData.damage_type;
        this.effects.push(eff);
    }

    get range(): number {
        return this.$attackData.range;
    }

    public GetAttackDescription(dweller: Dweller): string {
        let desc = this.name + "\n";
        let eff = this.effects[0];
        desc += "   " + eff.amount_base + "-" + eff.amount_max + " " + eff.damage_type + " damage\n";
        desc += "   range: " + this.$attackData.range + "\n";
        return desc;
    }
}
