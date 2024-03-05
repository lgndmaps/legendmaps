import GlobalConst from "../../types/globalConst";
import DwellerAttackData from "./DwellerAttackData";
import DwellerData from "./DwellerData";
import Dweller from "../dweller";
import RandomUtil from "../../utils/randomUtil";
import CombatAttack from "../../combat/combatAttack";
import {M_TurnEvent_Names} from "../../types/globalTypes";
import Spells from "../../effect/spells";

export class Quex extends DwellerData {
    constructor() {
        super(GlobalConst.DWELLER_KIND.QUEX, GlobalConst.DWELLER_ASCII.QUEX, GlobalConst.DWELLER_PHYLUM.MYTHIC);
        this.rarity = GlobalConst.RARITY.EPIC;
        this.size = GlobalConst.DWELLER_SIZE.MEDIUM;
        this.alertness = GlobalConst.DWELLER_ALERT_LEVELS.NORMAL;
        this.speed = GlobalConst.DWELLER_SPEED.NORMAL;
        this.level_names = ["Quex Acolyte", "Quex Acolyte", "Quex Priest", "Quex Priest", "Quex Archon", "Quex Archon"];

        this.lootType = GlobalConst.DWELLER_LOOT_TYPE.MAGIC_USER;
        this.level_number_appearing = [1, 2, 1, 1, 1, 1];
        this.setDefaultBaseValues();

        this.resistances = [GlobalConst.DAMAGE_TYPES.FIRE];
        this.immunities = [];
        this.vulnerabilities = [GlobalConst.DAMAGE_TYPES.COLD];

        this.basic_attack = new DwellerAttackData(this, "fire bolt");
        this.basic_attack.msg_hit = ["The [name] flings a fire bolt."];
        this.basic_attack.msg_miss = ["The [name] misses."];
        this.basic_attack.range = 3;
        this.basic_attack.damage_type = GlobalConst.DAMAGE_TYPES.FIRE;
        this.basic_attack.baseType = GlobalConst.DWELLER_ATTACK_TYPE.RANGED_MAGIC;

        this.special_attack_cooldown = 6;
        this.special_attack_description = "Blink. The quex teleports frequently.";
        //VARIATIONS
        this.setBaseDodge(DwellerData.BASE_DODGE * 0.8);
        this.setBaseHp(DwellerData.BASE_HP * 0.8);
        this.setBaseDef(DwellerData.BASE_DEF * 0.8);
        this.setBaseBlock(0);
        this.basic_attack.setBaseCrit(DwellerAttackData.BASE_CRIT * 0.8);
        this.basic_attack.setBaseHit(DwellerAttackData.BASE_HIT_BONUS * 1);
        this.basic_attack.setBaseDamage(DwellerAttackData.BASE_DAMAGE_MIN * 1, DwellerAttackData.BASE_DAMAGE_MAX * 1);
    }

    CheckSpecialAttack(dweller: Dweller): boolean {
        if (dweller.game.data.turn < dweller.turnSpecialLastUsed + this.special_attack_cooldown) {
            return false;
        }

        if (RandomUtil.instance.percentChance(25)) {
            return false;
        }

        if (!dweller.game.dungeon.IsFreeLinePathToTile(dweller.mapPos, dweller.game.dungeon.character.mapPos, 1)) {
            return false; //only teleport when next to player
        }

        //attack if possible, then blink
        if (dweller.game.dungeon.IsFreeLinePathToTile(dweller.mapPos, dweller.game.dungeon.character.mapPos, 3)) {
            let attack: CombatAttack = new CombatAttack(dweller.game, dweller, dweller.$primaryAttack);
            attack.AddTarget(dweller.game.dungeon.character);
            attack.doAttack();
        }

        //hack to prevent teleport from overwriting position too early.
        dweller.game.dungeon.AddTurnEvent(M_TurnEvent_Names.DWELLER_MOVE, {
            id: dweller.id,
            kind: dweller.kind,
            name: dweller.name,
            x: dweller.mapPos.x,
            y: dweller.mapPos.y,
        });

        Spells.Blink(dweller.game, dweller);

        dweller.game.dungeon.AddTurnEvent(M_TurnEvent_Names.DWELLER_MOVE, {
            id: dweller.id,
            kind: dweller.kind,
            name: dweller.name,
            x: dweller.mapPos.x,
            y: dweller.mapPos.y,
        });
        return true;
    }
}
