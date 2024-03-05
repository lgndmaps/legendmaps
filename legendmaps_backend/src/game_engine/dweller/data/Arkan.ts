import GlobalConst from "../../types/globalConst";
import DwellerAttackData from "./DwellerAttackData";
import DwellerData from "./DwellerData";
import Dweller from "../dweller";
import {M_TurnEvent_DwellerSpecial, M_TurnEvent_Names} from "../../types/globalTypes";
import CombatAttack from "../../combat/combatAttack";

export class Arkan extends DwellerData {
    constructor() {
        super(GlobalConst.DWELLER_KIND.ARKAN, GlobalConst.DWELLER_ASCII.ARKAN, GlobalConst.DWELLER_PHYLUM.FEY);
        this.size = GlobalConst.DWELLER_SIZE.MEDIUM;
        this.rarity = GlobalConst.RARITY.RARE;
        this.alertness = GlobalConst.DWELLER_ALERT_LEVELS.NORMAL;
        this.speed = GlobalConst.DWELLER_SPEED.NORMAL;
        this.level_names = ["arkan fawn", "arkan fawn", "arkan", "arkan", "arkan warrior", "arkan hart"];

        this.lootType = GlobalConst.DWELLER_LOOT_TYPE.HUMANOID;
        this.level_number_appearing = [1, 2, 1, 2, 1, 1];
        this.setDefaultBaseValues();
        this.setBaseDodge(DwellerData.BASE_DODGE * 1.1);
        this.setBaseHp(DwellerData.BASE_HP * 1.2);
        this.setBaseDef(DwellerData.BASE_DEF * 0.8);

        this.resistances = [GlobalConst.DAMAGE_TYPES.COLD];
        this.immunities = [];
        this.vulnerabilities = [GlobalConst.DAMAGE_TYPES.ELECTRIC];

        this.basic_attack = new DwellerAttackData(this, "heavy axe");
        this.basic_attack.setBaseCrit(0); //does not crit
        let damagemid =
            DwellerAttackData.BASE_DAMAGE_MIN +
            Math.round(DwellerAttackData.BASE_DAMAGE_MAX - DwellerAttackData.BASE_DAMAGE_MIN);
        this.basic_attack.setBaseDamage(damagemid, damagemid); //consistent damage
        this.basic_attack.setBaseHit(DwellerAttackData.BASE_HIT_BONUS * 1.3); //high hit chance
        this.basic_attack.msg_hit = ["The [name] strikes with its axe.", "The [name] hits with its axe."];
        this.basic_attack.msg_miss = ["The [name] misses."];
        this.basic_attack.range = 1;
        this.basic_attack.damage_type = GlobalConst.DAMAGE_TYPES.BLADE;
        this.basic_attack.baseType = GlobalConst.DWELLER_ATTACK_TYPE.MELEE_SLASH;

        this.special_attack_description = "Flurry of Blows: multiple strikes in one turn";
    }

    CheckSpecialAttack(dweller: Dweller): boolean {
        if (dweller.game.data.turn < dweller.turnSpecialLastUsed + this.special_attack_cooldown) {
            //still on cooldown
            return false;
        }
        if (dweller.game.dungeon.IsFreeLinePathToTile(dweller.mapPos, dweller.game.dungeon.character.mapPos, 1)) {
            dweller.turnSpecialLastUsed = dweller.game.data.turn;
            dweller.game.dungeon.AddTurnEvent(M_TurnEvent_Names.DWELLER_SPECIAL, {
                id: dweller.id,
                name: dweller.name,
                kind: "Dweller",
                setupDesc: "The " + dweller.name + " spins its axe, ready to unleash a flurry of blows!",
                resultDesc: " ",
            } as M_TurnEvent_DwellerSpecial);
            for (let i = 0; i < 2; i++) {
                let attack: CombatAttack = new CombatAttack(dweller.game, dweller, dweller.$primaryAttack);
                attack.AddTarget(dweller.game.dungeon.character);
                attack.doAttack();
            }

            return true;
        }
        return false;
    }
}
