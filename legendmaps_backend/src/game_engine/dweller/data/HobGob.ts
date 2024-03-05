import GlobalConst from "../../types/globalConst";
import DwellerAttackData from "./DwellerAttackData";
import DwellerData from "./DwellerData";
import Dweller from "../dweller";
import RandomUtil from "../../utils/randomUtil";
import CombatAttack from "../../combat/combatAttack";
import MapPos from "../../utils/mapPos";
import {M_TurnEvent_Names, M_TurnEvent_PlayerMove} from "../../types/globalTypes";

export class HobGob extends DwellerData {
    constructor() {
        super(GlobalConst.DWELLER_KIND.HOBGOB, GlobalConst.DWELLER_ASCII.HOBGOB, GlobalConst.DWELLER_PHYLUM.HUMANOID);
        this.size = GlobalConst.DWELLER_SIZE.MEDIUM;
        this.alertness = GlobalConst.DWELLER_ALERT_LEVELS.NORMAL;
        this.speed = GlobalConst.DWELLER_SPEED.NORMAL;
        this.level_names = ["hob gob", "hob gob", "hob gob guard", "hob gob guard", "hob gob chief", "hob gob chief"];

        this.lootType = GlobalConst.DWELLER_LOOT_TYPE.HUMANOID;
        this.level_number_appearing = [1, 1, 1, 2, 1, 1];
        this.setDefaultBaseValues();

        this.resistances = [GlobalConst.DAMAGE_TYPES.FIRE];
        this.immunities = [];
        this.vulnerabilities = [GlobalConst.DAMAGE_TYPES.ARCANE];

        this.basic_attack = new DwellerAttackData(this, "heavy hammer");
        this.basic_attack.msg_hit = ["The [name] hits.", "The [name] strikes."];
        this.basic_attack.msg_miss = ["The [name] misses."];
        this.basic_attack.range = 1;
        this.basic_attack.damage_type = GlobalConst.DAMAGE_TYPES.BLUDGEON;
        this.basic_attack.baseType = GlobalConst.DWELLER_ATTACK_TYPE.MELEE_BLUDGEON;

        this.special_attack_cooldown = 5;
        this.special_attack_description = "Staggering Blow. Heavy swing which knocks victims away.";
        //VARIATIONS
        this.setBaseDodge(DwellerData.BASE_DODGE * 0.6);
        this.setBaseHp(DwellerData.BASE_HP * 1);
        this.setBaseDef(DwellerData.BASE_DEF * 0.8);
        this.setBaseBlock(10);
        this.basic_attack.setBaseCrit(0);
        this.basic_attack.setBaseHit(DwellerAttackData.BASE_HIT_BONUS * 0.7);
        this.basic_attack.setBaseDamage(
            DwellerAttackData.BASE_DAMAGE_MIN * 1.25,
            DwellerAttackData.BASE_DAMAGE_MAX * 1.25,
        );
    }

    CheckSpecialAttack(dweller: Dweller): boolean {
        if (dweller.game.data.turn < dweller.turnSpecialLastUsed + this.special_attack_cooldown) {
            return false;
        }

        if (RandomUtil.instance.percentChance(50)) {
            return false;
        }

        //attack if possible, then blink
        if (dweller.game.dungeon.IsFreeLinePathToTile(dweller.mapPos, dweller.game.dungeon.character.mapPos, 1)) {
            let pc = dweller.game.dungeon.character;
            //get vector between two points
            let vector = new MapPos(pc.mapPos.x - dweller.mapPos.x, pc.mapPos.y - dweller.mapPos.y);
            let targetTile = new MapPos(pc.mapPos.x + vector.x, pc.mapPos.y + vector.y);
            if (!dweller.game.dungeon.TileIsWalkable(targetTile.x, targetTile.y)) {
                return false;
            }

            let attack: CombatAttack = new CombatAttack(dweller.game, dweller, dweller.$primaryAttack);
            attack.AddTarget(dweller.game.dungeon.character);
            attack.doAttack();

            if (attack.$isHit) {
                dweller.turnSpecialLastUsed = dweller.game.data.turn;
                if (pc.traitIds.includes(48)) {
                    dweller.game.dungeon.AddMessageEvent("Immune to knockback (oafish)", [
                        GlobalConst.MESSAGE_FLAGS.APPEND,
                    ]);
                    return true;
                }

                dweller.game.dungeon.AddMessageEvent(dweller.name + " knocks you backwards!", [
                    GlobalConst.MESSAGE_FLAGS.APPEND,
                ]);
                pc.mapEntity.pos = targetTile;
                dweller.game.dungeon.AddTurnEvent(M_TurnEvent_Names.PLAYER_MOVE, {
                    x: targetTile.x,
                    y: targetTile.y,
                } as M_TurnEvent_PlayerMove);

                return true;
            } else {
                return false;
            }
        }
    }
}
