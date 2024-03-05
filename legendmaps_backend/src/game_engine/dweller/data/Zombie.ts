import GlobalConst from "../../types/globalConst";
import DwellerAttackData from "./DwellerAttackData";
import DwellerData from "./DwellerData";
import Dweller from "../dweller";
import Effect from "../../effect/effect";
import Spells from "../../effect/spells";

export class Zombie extends DwellerData {
    constructor() {
        super(GlobalConst.DWELLER_KIND.ZOMBIE, GlobalConst.DWELLER_ASCII.ZOMBIE, GlobalConst.DWELLER_PHYLUM.UNDEAD);
        this.size = GlobalConst.DWELLER_SIZE.MEDIUM;
        this.alertness = GlobalConst.DWELLER_ALERT_LEVELS.NORMAL;
        this.speed = GlobalConst.DWELLER_SPEED.NORMAL;
        this.level_names = ["decrepit zombie", "decayed zombie", "zombie", "zombie", "giant zombie", "giant zombie"];

        this.lootType = GlobalConst.DWELLER_LOOT_TYPE.HUMANOID;
        this.level_number_appearing = [3, 3, 3, 3, 3, 3];
        this.setDefaultBaseValues();

        this.resistances = [GlobalConst.DAMAGE_TYPES.COLD];
        this.immunities = [];
        this.vulnerabilities = [GlobalConst.DAMAGE_TYPES.FIRE, GlobalConst.DAMAGE_TYPES.ARCANE];

        this.basic_attack = new DwellerAttackData(this, "rotting hands");
        this.basic_attack.msg_hit = ["The [name] hits.", "The [name] strikes."];
        this.basic_attack.msg_miss = ["The [name] misses."];
        this.basic_attack.range = 1;
        this.basic_attack.damage_type = GlobalConst.DAMAGE_TYPES.NECROTIC;
        this.basic_attack.baseType = GlobalConst.DWELLER_ATTACK_TYPE.MELEE_SLASH;

        this.special_attack_cooldown = 5;
        this.special_attack_description = "None.";
        //VARIATIONS
        this.setBaseDodge(0);
        this.setBaseHp(DwellerData.BASE_HP * 1.1);
        this.setBaseDef(DwellerData.BASE_DEF * 1);
        this.setBaseBlock(DwellerData.BASE_BLOCK * 1);
        this.basic_attack.setBaseCrit(DwellerAttackData.BASE_CRIT * 1);
        this.basic_attack.setBaseHit(DwellerAttackData.BASE_HIT_BONUS * 0.9);
        this.basic_attack.setBaseDamage(
            DwellerAttackData.BASE_DAMAGE_MIN * 0.7,
            DwellerAttackData.BASE_DAMAGE_MAX * 0.7,
        );
    }

    CheckSpecialAttack(dweller: Dweller): boolean {
        return false;
    }

    CheckSpecialOnDeath(dweller: Dweller): boolean {
        //explode here.

        //let attack: CombatAttack = new CombatAttack(dweller.game, dweller, dweller.$primaryAttack);
        //attack.AddTarget(dweller.game.dungeon.character);
        //attack.doAttack();

        let new_eff: Effect = new Effect(dweller.game);
        new_eff.name = "Zombie Explosion";
        new_eff.type = GlobalConst.EFFECT_TYPES.SPELL;
        new_eff.trigger = GlobalConst.EFFECT_TRIGGERS.USE;
        new_eff.name = GlobalConst.SPELLS.AOE_DWELLER;
        new_eff.damage_type = GlobalConst.DAMAGE_TYPES.NECROTIC;
        new_eff.amount_base = Math.round(3 + dweller.level * 2.5);
        new_eff.amount_max = new_eff.amount_base;
        Spells.AOE(dweller.game, dweller, dweller, new_eff);

        return true;
    }
}
