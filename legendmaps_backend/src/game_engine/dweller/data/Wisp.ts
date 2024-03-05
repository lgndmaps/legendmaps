import GlobalConst from "../../types/globalConst";
import DwellerAttackData from "./DwellerAttackData";
import DwellerData from "./DwellerData";
import Dweller from "../dweller";
import DAMAGE_TYPES = GlobalConst.DAMAGE_TYPES;
import RandomUtil from "../../utils/randomUtil";
import CombatAttack from "../../combat/combatAttack";
import { M_TurnEvent_Names, M_TurnEvent_PlayerMove } from "../../types/globalTypes";
import Spells from "../../effect/spells";

export class Wisp extends DwellerData {
    constructor() {
        super(GlobalConst.DWELLER_KIND.WISP, GlobalConst.DWELLER_ASCII.WISP, GlobalConst.DWELLER_PHYLUM.FEY);
        this.rarity = GlobalConst.RARITY.EPIC;
        this.size = GlobalConst.DWELLER_SIZE.MEDIUM;
        this.alertness = GlobalConst.DWELLER_ALERT_LEVELS.NORMAL;
        this.speed = GlobalConst.DWELLER_SPEED.NORMAL;
        this.level_names = ["lesser wisp", "lesser wisp", "wisp", "wisp", "elder wisp", "ancient wisp"];

        this.lootType = GlobalConst.DWELLER_LOOT_TYPE.MAGIC_USER;
        this.level_number_appearing = [1, 1, 1, 1, 1, 1];
        this.setDefaultBaseValues();

        this.resistances = [GlobalConst.DAMAGE_TYPES.BLUDGEON, GlobalConst.DAMAGE_TYPES.BLADE, DAMAGE_TYPES.PIERCE];
        this.immunities = [];
        this.vulnerabilities = [GlobalConst.DAMAGE_TYPES.ARCANE];

        this.basic_attack = new DwellerAttackData(this, "zap");
        this.basic_attack.msg_hit = ["The [name] zaps."];
        this.basic_attack.msg_miss = ["The [name] misses."];
        this.basic_attack.range = 1;
        this.basic_attack.damage_type = GlobalConst.DAMAGE_TYPES.DIVINE;
        this.basic_attack.baseType = GlobalConst.DWELLER_ATTACK_TYPE.RANGED_MAGIC;

        this.special_attack_cooldown = 5;
        this.special_attack_description = "Unstable Position. Random teleporting of itself and targets.";
        //VARIATIONS
        this.setBaseDodge(DwellerData.BASE_DODGE * 1);
        this.setBaseHp(DwellerData.BASE_HP * 1);
        this.setBaseDef(DwellerData.BASE_DEF * 1);
        this.setBaseBlock(DwellerData.BASE_BLOCK * 1);
        this.basic_attack.setBaseCrit(DwellerAttackData.BASE_CRIT * 1);
        this.basic_attack.setBaseHit(DwellerAttackData.BASE_HIT_BONUS * 1);
        this.basic_attack.setBaseDamage(DwellerAttackData.BASE_DAMAGE_MIN * 1, DwellerAttackData.BASE_DAMAGE_MAX * 1);
    }

    CheckSpecialAttack(dweller: Dweller): boolean {
        if (dweller.game.data.turn < dweller.turnSpecialLastUsed + this.special_attack_cooldown) {
            return false;
        }

        if (RandomUtil.instance.percentChance(50)) {
            return false;
        }

        if (!dweller.game.dungeon.IsFreeLinePathToTile(dweller.mapPos, dweller.game.dungeon.character.mapPos, 1)) {
            return false; //only teleport when next to player
        }

        //attack if possible, then blink
        if (dweller.game.dungeon.IsFreeLinePathToTile(dweller.mapPos, dweller.game.dungeon.character.mapPos, 1)) {
            let attack: CombatAttack = new CombatAttack(dweller.game, dweller, dweller.$primaryAttack);
            attack.AddTarget(dweller.game.dungeon.character);
            attack.doAttack();
        }

        //hack to prevent teleport from overwriting position too early.
        // console.log("DWELLER MAP POS IS " + dweller.mapPos.toStr());
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

        dweller.game.dungeon.AddTurnEvent(M_TurnEvent_Names.PLAYER_MOVE, {
            x: dweller.game.dungeon.character.mapPos.x,
            y: dweller.game.dungeon.character.mapPos.y,
        } as M_TurnEvent_PlayerMove);
        Spells.Blink(dweller.game, dweller.game.dungeon.character);
        dweller.game.dungeon.AddTurnEvent(M_TurnEvent_Names.PLAYER_MOVE, {
            x: dweller.game.dungeon.character.mapPos.x,
            y: dweller.game.dungeon.character.mapPos.y,
        } as M_TurnEvent_PlayerMove);
        return true;
    }
}
