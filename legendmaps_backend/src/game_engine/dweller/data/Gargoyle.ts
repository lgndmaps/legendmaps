import GlobalConst from "../../types/globalConst";
import DwellerAttackData from "./DwellerAttackData";
import DwellerData from "./DwellerData";
import Dweller from "../dweller";
import { M_TurnEvent_DwellerSpecial, M_TurnEvent_Names } from "../../types/globalTypes";
import CombatAttack from "../../combat/combatAttack";

export class Gargoyle extends DwellerData {
    constructor() {
        super(GlobalConst.DWELLER_KIND.GARGOYLE, GlobalConst.DWELLER_ASCII.GARGOYLE, GlobalConst.DWELLER_PHYLUM.MYTHIC);
        this.rarity = GlobalConst.RARITY.RARE;
        this.size = GlobalConst.DWELLER_SIZE.LARGE;
        this.alertness = GlobalConst.DWELLER_ALERT_LEVELS.NORMAL;
        this.speed = GlobalConst.DWELLER_SPEED.NORMAL;
        this.level_names = [
            "chipped gargoyle",
            "chipped gargoyle",
            "gargoyle",
            "large gargoyle",
            "large gargoyle",
            "huge gargoyle",
        ];

        this.lootType = GlobalConst.DWELLER_LOOT_TYPE.HUMANOID;
        this.level_number_appearing = [1, 1, 2, 1, 2, 1];
        this.setDefaultBaseValues();

        this.resistances = [GlobalConst.DAMAGE_TYPES.BLUDGEON];
        this.immunities = [];
        this.vulnerabilities = [];

        this.basic_attack = new DwellerAttackData(this, "stone fist");
        this.basic_attack.msg_hit = ["The [name] hits.", "The [name] strikes."];
        this.basic_attack.msg_miss = ["The [name] misses."];
        this.basic_attack.range = 1;
        this.basic_attack.damage_type = GlobalConst.DAMAGE_TYPES.BLUDGEON;
        this.basic_attack.baseType = GlobalConst.DWELLER_ATTACK_TYPE.MELEE_BLUDGEON;

        this.special_attack_cooldown = 0;
        this.special_attack_description = "Fast attacks. Strikes twice per turn.";
        //VARIATIONS
        this.setBaseDodge(DwellerData.BASE_DODGE * 0.25);
        this.setBaseHp(DwellerData.BASE_HP * 1.25);
        this.setBaseDef(DwellerData.BASE_DEF * 1);
        this.setBaseBlock(DwellerData.BASE_BLOCK * 1);
        this.basic_attack.setBaseCrit(DwellerAttackData.BASE_CRIT * 0.9);
        this.basic_attack.setBaseHit(DwellerAttackData.BASE_HIT_BONUS * 0.95);
        this.basic_attack.setBaseDamage(
            DwellerAttackData.BASE_DAMAGE_MIN * 0.9,
            DwellerAttackData.BASE_DAMAGE_MAX * 0.75,
        );
    }

    CheckSpecialAttack(dweller: Dweller): boolean {
        if (dweller.game.dungeon.IsFreeLinePathToTile(dweller.mapPos, dweller.game.dungeon.character.mapPos, 1)) {
            dweller.turnSpecialLastUsed = dweller.game.data.turn;
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
