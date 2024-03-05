import GlobalConst from "../../types/globalConst";
import DwellerAttackData from "./DwellerAttackData";
import DwellerData from "./DwellerData";
import Dweller from "../dweller";
import { M_TurnEvent_DwellerSpecial, M_TurnEvent_Names } from "../../types/globalTypes";
import CombatAttack from "../../combat/combatAttack";
import Character from "../../character/character";
import RandomUtil from "../../utils/randomUtil";
import DwellerAttack from "../dwellerAttack";
import ItemGenCommon from "../../item/itemgen/itemGenCommon";
import Effect from "../../effect/effect";

export class Manticore extends DwellerData {
    constructor() {
        super(
            GlobalConst.DWELLER_KIND.MANTICORE,
            GlobalConst.DWELLER_ASCII.MANTICORE,
            GlobalConst.DWELLER_PHYLUM.MYTHIC,
        );
        this.rarity = GlobalConst.RARITY.LEGENDARY;
        this.size = GlobalConst.DWELLER_SIZE.LARGE;
        this.alertness = GlobalConst.DWELLER_ALERT_LEVELS.NORMAL;
        this.speed = GlobalConst.DWELLER_SPEED.NORMAL;
        this.level_names = [
            "manticore cub",
            "manticore",
            "manticore",
            "manticore elder",
            "manticore lord",
            "manticore king",
        ];

        this.lootType = GlobalConst.DWELLER_LOOT_TYPE.BEAST;
        this.level_number_appearing = [1, 1, 1, 1, 1, 1];
        this.setDefaultBaseValues();
        this.setBaseDodge(DwellerData.BASE_DODGE * 1.1);
        this.setBaseHp(DwellerData.BASE_HP * 1.7);

        this.resistances = [GlobalConst.DAMAGE_TYPES.DIVINE];
        this.immunities = [];
        this.vulnerabilities = [GlobalConst.DAMAGE_TYPES.NECROTIC];

        this.basic_attack = new DwellerAttackData(this, "fangs");
        this.basic_attack.msg_hit = [
            "The [name] hits.",
            "The [name]'s fangs find their mark.",
            "The [name] sinks its fangs into you.",
        ];
        this.basic_attack.msg_miss = ["The [name] misses."];
        this.basic_attack.setBaseCrit(DwellerAttackData.BASE_CRIT * 2); // crits often

        this.basic_attack.setBaseDamage(DwellerAttackData.BASE_DAMAGE_MIN - 1, DwellerAttackData.BASE_DAMAGE_MAX - 1); //slightly lower normal damage
        this.basic_attack.setBaseHit(DwellerAttackData.BASE_HIT_BONUS * 0.8); //reduced hit chance
        this.basic_attack.range = 1;
        this.basic_attack.damage_type = GlobalConst.DAMAGE_TYPES.PIERCE;
        this.basic_attack.baseType = GlobalConst.DWELLER_ATTACK_TYPE.MELEE_BITE;
        this.special_attack_description = "Tail Lash: Lash with tail of venomous spikes";
        this.special_attack_cooldown = 3;
    }

    CheckSpecialAttack(dweller: Dweller): boolean {
        if (dweller.game.data.turn < dweller.turnSpecialLastUsed + this.special_attack_cooldown) {
            //still on cooldown
            return false;
        }
        if (RandomUtil.instance.percentChance(50)) {
            // only uses it half the time it's available
            return false;
        }
        if (dweller.game.dungeon.IsFreeLinePathToTile(dweller.mapPos, dweller.game.dungeon.character.mapPos, 2)) {
            dweller.turnSpecialLastUsed = dweller.game.data.turn;
            /*
            dweller.game.dungeon.AddTurnEvent(M_TurnEvent_Names.DWELLER_SPECIAL, {
                id: dweller.id,
                name: dweller.name,
                kind: "Dweller",
                setupDesc: "The " + dweller.name + " lashes its venom-spiked tail at you!",
                resultDesc: " ",
            } as M_TurnEvent_DwellerSpecial);
*/
            // do poison attack
            let special_attack_data: DwellerAttackData = new DwellerAttackData(this, "poison tail");

            special_attack_data.baseType = GlobalConst.DWELLER_ATTACK_TYPE.MELEE_BLUDGEON;
            special_attack_data.range = 2;
            special_attack_data.damage_type = GlobalConst.DAMAGE_TYPES.POISON;

            let special_attack: DwellerAttack = new DwellerAttack(dweller.game, dweller, special_attack_data);
            special_attack.rarity = GlobalConst.RARITY.EPIC;

            // add chance to give poisoned condition
            // ItemGenCommon.AddEnhancementById(GlobalConst.ITEM_ENHANCEMENTS.COND_POISON, special_attack);
            let level_poisoned_chance: number[] = [20, 25, 30, 40, 50, 60]; // by dweller level
            special_attack.AddCondition(
                GlobalConst.CONDITION.POISONED,
                GlobalConst.EFFECT_TRIGGERS.HIT,
                GlobalConst.SOURCE_TYPE.TEMPORARY,
                special_attack.id,
                5,
                level_poisoned_chance[dweller.level],
            );

            let attack: CombatAttack = new CombatAttack(dweller.game, dweller, special_attack);
            attack.AddTarget(dweller.game.dungeon.character);
            attack.doAttack();
            return true;
        }
        return false;
    }
}
