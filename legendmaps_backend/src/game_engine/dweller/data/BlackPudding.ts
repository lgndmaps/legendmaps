import GlobalConst from "../../types/globalConst";
import DwellerAttackData from "./DwellerAttackData";
import DwellerData from "./DwellerData";
import Dweller from "../dweller";
import Spells from "../../effect/spells";
import Effect from "../../effect/effect";
import FlagUtil from "../../utils/flagUtil";
import CombatAttack from "../../combat/combatAttack";

export class BlackPudding extends DwellerData {
    constructor() {
        super(
            GlobalConst.DWELLER_KIND.BLACK_PUDDING,
            GlobalConst.DWELLER_ASCII.BLACK_PUDDING,
            GlobalConst.DWELLER_PHYLUM.OOZE,
        );
        this.rarity = GlobalConst.RARITY.EPIC;
        this.size = GlobalConst.DWELLER_SIZE.LARGE;
        this.alertness = GlobalConst.DWELLER_ALERT_LEVELS.LOW;
        this.speed = GlobalConst.DWELLER_SPEED.SLOW;
        this.level_names = [
            "black pudding",
            "black pudding",
            "black pudding",
            "aged black pudding",
            "aged black pudding",
            "aged black pudding",
        ];

        this.lootType = GlobalConst.DWELLER_LOOT_TYPE.HUMANOID;
        this.level_number_appearing = [1, 2, 3, 1, 2, 1];
        this.setDefaultBaseValues();
        this.setBaseHp(DwellerData.BASE_HP * 1.5);
        this.setBaseDef(DwellerData.BASE_DEF * 0.75);
        this.resistances = [GlobalConst.DAMAGE_TYPES.COLD];
        this.immunities = [GlobalConst.DAMAGE_TYPES.BLUDGEON];
        this.vulnerabilities = [GlobalConst.DAMAGE_TYPES.FIRE];

        this.basic_attack = new DwellerAttackData(this, "appendage");
        this.basic_attack.msg_hit = ["The [name] hits.", "The [name] strikes."];
        this.basic_attack.msg_miss = ["The [name] misses."];
        this.basic_attack.range = 1;
        this.basic_attack.damage_type = GlobalConst.DAMAGE_TYPES.NECROTIC;
        this.basic_attack.baseType = GlobalConst.DWELLER_ATTACK_TYPE.MELEE_BLUDGEON;
        this.special_attack_description = "Unstable: explodes on death in a freezing blast.";
    }

    CheckSpecialOnDeath(dweller: Dweller): boolean {
        //explode here.

        //let attack: CombatAttack = new CombatAttack(dweller.game, dweller, dweller.$primaryAttack);
        //attack.AddTarget(dweller.game.dungeon.character);
        //attack.doAttack();

        let new_eff: Effect = new Effect(dweller.game);
        new_eff.name = "Black Pudding Explosion";
        new_eff.type = GlobalConst.EFFECT_TYPES.SPELL;
        new_eff.trigger = GlobalConst.EFFECT_TRIGGERS.USE;
        new_eff.name = GlobalConst.SPELLS.AOE_DWELLER;
        new_eff.damage_type = GlobalConst.DAMAGE_TYPES.COLD;
        new_eff.amount_base = Math.round(6 + dweller.level * 2.5);
        Spells.AOE(dweller.game, dweller, dweller, new_eff);

        return true;
    }
}
