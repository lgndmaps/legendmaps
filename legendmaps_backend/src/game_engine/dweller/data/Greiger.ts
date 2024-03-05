import GlobalConst from "../../types/globalConst";
import DwellerAttackData from "./DwellerAttackData";
import DwellerData from "./DwellerData";
import Dweller from "../dweller";
import RandomUtil from "../../utils/randomUtil";
import DwellerAttack from "../dwellerAttack";
import CombatAttack from "../../combat/combatAttack";
import Character from "../../character/character";
import { M_TurnEvent_DwellerSpecial, M_TurnEvent_Names } from "../../types/globalTypes";
import ConditionManager from "../../effect/conditionManager";

export class Greiger extends DwellerData {
    constructor() {
        super(GlobalConst.DWELLER_KIND.GREIGER, GlobalConst.DWELLER_ASCII.GREIGER, GlobalConst.DWELLER_PHYLUM.DEEP_ONE);
        this.rarity = GlobalConst.RARITY.LEGENDARY;
        this.size = GlobalConst.DWELLER_SIZE.LARGE;
        this.alertness = GlobalConst.DWELLER_ALERT_LEVELS.NORMAL;
        this.speed = GlobalConst.DWELLER_SPEED.NORMAL;
        this.level_names = ["greiger", "greiger", "greiger", "greiger", "greiger", "greiger"];

        this.lootType = GlobalConst.DWELLER_LOOT_TYPE.BEAST;
        this.level_number_appearing = [1, 1, 1, 1, 1, 1];
        this.setDefaultBaseValues();

        this.resistances = [];
        this.immunities = [];
        this.vulnerabilities = [];

        this.basic_attack = new DwellerAttackData(this, "spectral tentacle");
        this.basic_attack.msg_hit = ["The [name] lashes."];
        this.basic_attack.msg_miss = ["The [name] misses."];
        this.basic_attack.range = 2;
        this.basic_attack.damage_type = GlobalConst.DAMAGE_TYPES.ARCANE;
        this.basic_attack.baseType = GlobalConst.DWELLER_ATTACK_TYPE.RANGED_MAGIC;

        this.special_attack_cooldown = 25;
        this.special_attack_description = "Cosmic Horror. Leaves their victims confused and with their spirit broken.";
        //VARIATIONS
        this.setBaseDodge(0);
        this.setBaseHp(DwellerData.BASE_HP * 1.5);
        this.setBaseDef(DwellerData.BASE_DEF * 1);
        this.setBaseBlock(DwellerData.BASE_BLOCK * 1);
        this.basic_attack.setBaseCrit(DwellerAttackData.BASE_CRIT * 0.6);
        this.basic_attack.setBaseHit(DwellerAttackData.BASE_HIT_BONUS * 1.1);
        this.basic_attack.setBaseDamage(DwellerAttackData.BASE_DAMAGE_MIN * 1.2, DwellerAttackData.BASE_DAMAGE_MAX * 1);
    }

    CheckSpecialAttack(dweller: Dweller): boolean {
        if (dweller.game.data.turn < dweller.turnSpecialLastUsed + this.special_attack_cooldown) {
            //still on cooldowna
            return false;
        }

        let rangeToPlayer = dweller.game.dungeon.GetTileDistance(dweller.mapPos, dweller.game.dungeon.character.mapPos);
        if (
            rangeToPlayer > 1 &&
            dweller.game.dungeon.IsFreeLinePathToTile(dweller.mapPos, dweller.game.dungeon.character.mapPos, 3) &&
            RandomUtil.instance.percentChance(60)
        ) {
            dweller.turnSpecialLastUsed = dweller.game.data.turn;
            let pc: Character = dweller.game.dungeon.character;
            let setup: string = "The unspeakable vision of " + dweller.name + " assails your mind.";
            let success: boolean = false;
            let result: string = "";
            if (pc.skillIds.includes(50)) {
                result = "You are immune (skill: magicproof).";
            } else if (pc.traitIds.includes(53)) {
                result = "You are immune (trait: focused).";
            } else if (RandomUtil.instance.percentChance(20 + GlobalConst.GetGenericBagsBonus(pc.spirit) * 2)) {
                result = "Your manage to resist and hold your sanity (spirit).";
                success = false;
            } else {
                success = true;
            }

            if (success) {
                let holdfor = 5 + dweller.level;
                ConditionManager.instance.GiveCondition(
                    pc,
                    GlobalConst.CONDITION.CONFUSED,
                    GlobalConst.SOURCE_TYPE.TEMPORARY,
                    dweller.id,
                    holdfor,
                );

                let dur = 50 + dweller.level * 10;
                let loss = 4 + dweller.level;
                result =
                    "Horrified. -" +
                    loss +
                    " spirit for " +
                    dur +
                    " turns. You are confused for " +
                    (holdfor - 1) +
                    " turns.";
                this.ApplyCurseEffect(
                    dweller.game.dungeon.character,
                    "cosmic horror",
                    GlobalConst.ATTRIBUTES.SPIRIT,
                    dur,
                    loss,
                );
            }
            dweller.game.dungeon.AddTurnEvent(M_TurnEvent_Names.DWELLER_SPECIAL, {
                id: dweller.id,
                name: dweller.name,
                kind: "Dweller",
                setupDesc: setup,
                resultDesc: result,
            } as M_TurnEvent_DwellerSpecial);

            return true;
        }

        return false;
    }
}
