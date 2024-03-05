import GlobalConst from "../../types/globalConst";
import DwellerAttackData from "./DwellerAttackData";
import DwellerData from "./DwellerData";
import Dweller from "../dweller";
import RandomUtil from "../../utils/randomUtil";
import Character from "../../character/character";
import CombatAttack from "../../combat/combatAttack";
import { M_TurnEvent_DwellerSpecial, M_TurnEvent_Names } from "../../types/globalTypes";

export class Wererat extends DwellerData {
    constructor() {
        super(GlobalConst.DWELLER_KIND.WERERAT, GlobalConst.DWELLER_ASCII.WERERAT, GlobalConst.DWELLER_PHYLUM.BEAST);
        this.size = GlobalConst.DWELLER_SIZE.MEDIUM;
        this.alertness = GlobalConst.DWELLER_ALERT_LEVELS.NORMAL;
        this.speed = GlobalConst.DWELLER_SPEED.NORMAL;
        this.level_names = [
            "frail wererat",
            "wererat",
            "wererat",
            "wererat warrior",
            "wererat warrior",
            "wererat king",
        ];

        this.lootType = GlobalConst.DWELLER_LOOT_TYPE.HUMANOID;
        this.level_number_appearing = [1, 1, 2, 1, 1, 1];
        this.setDefaultBaseValues();

        this.resistances = [];
        this.immunities = [];
        this.vulnerabilities = [GlobalConst.DAMAGE_TYPES.DIVINE];

        this.basic_attack = new DwellerAttackData(this, "claws");
        this.basic_attack.msg_hit = ["The [name] hits.", "The [name] strikes."];
        this.basic_attack.msg_miss = ["The [name] misses."];
        this.basic_attack.range = 1;
        this.basic_attack.damage_type = GlobalConst.DAMAGE_TYPES.BLADE;
        this.basic_attack.baseType = GlobalConst.DWELLER_ATTACK_TYPE.MELEE_SLASH;

        this.special_attack_cooldown = 0;
        this.special_attack_description = "Hunger strike. The wererat's attacks drain nourishment.";
        //VARIATIONS
        this.setBaseDodge(DwellerData.BASE_DODGE * 1.1);
        this.setBaseHp(DwellerData.BASE_HP * 1);
        this.setBaseDef(DwellerData.BASE_DEF * 1);
        this.setBaseBlock(DwellerData.BASE_BLOCK * 1);
        this.basic_attack.setBaseCrit(DwellerAttackData.BASE_CRIT * 1);
        this.basic_attack.setBaseHit(DwellerAttackData.BASE_HIT_BONUS * 1);
        this.basic_attack.setBaseDamage(DwellerAttackData.BASE_DAMAGE_MIN * 1, DwellerAttackData.BASE_DAMAGE_MAX * 1);
    }

    CheckSpecialAttack(dweller: Dweller): boolean {
        if (dweller.game.dungeon.IsFreeLinePathToTile(dweller.mapPos, dweller.game.dungeon.character.mapPos, 1)) {
            let pc: Character = dweller.game.dungeon.character;

            let attack: CombatAttack = new CombatAttack(dweller.game, dweller, dweller.$primaryAttack);
            attack.AddTarget(dweller.game.dungeon.character);
            attack.doAttack();

            if (attack.$isHit) {
                dweller.game.dungeon.AddMessageEvent("The wererat's attack drains nourishment!", [
                    GlobalConst.MESSAGE_FLAGS.APPEND,
                ]);
                pc.ModifyHunger(-3 * dweller.level);
            }
            return true;
        }
        return false;
    }
}
