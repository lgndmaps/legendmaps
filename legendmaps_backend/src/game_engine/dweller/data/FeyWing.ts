import GlobalConst from "../../types/globalConst";
import DwellerAttackData from "./DwellerAttackData";
import DwellerData from "./DwellerData";
import Dweller from "../dweller";
import Spells from "../../effect/spells";
import RandomUtil from "../../utils/randomUtil";
import CombatAttack from "../../combat/combatAttack";
import {M_TurnEvent_Names} from "../../types/globalTypes";

export class FeyWing extends DwellerData {
    constructor() {
        super(GlobalConst.DWELLER_KIND.FEY_WING, GlobalConst.DWELLER_ASCII.FEY_WING, GlobalConst.DWELLER_PHYLUM.FEY);
        this.size = GlobalConst.DWELLER_SIZE.SMALL;
        this.rarity = GlobalConst.RARITY.RARE;
        this.alertness = GlobalConst.DWELLER_ALERT_LEVELS.NORMAL;
        this.speed = GlobalConst.DWELLER_SPEED.NORMAL;
        this.level_names = [
            "feywing pixie",
            "feywing pixie",
            "feywing fairie",
            "feywing fairie",
            "feywing queen",
            "feywing queen",
        ];

        this.lootType = GlobalConst.DWELLER_LOOT_TYPE.MAGIC_USER;
        this.level_number_appearing = [1, 2, 1, 2, 1, 1];
        this.setDefaultBaseValues();

        this.resistances = [GlobalConst.DAMAGE_TYPES.DIVINE];
        this.immunities = [];
        this.vulnerabilities = [GlobalConst.DAMAGE_TYPES.BLUDGEON];

        this.basic_attack = new DwellerAttackData(this, "zap");
        this.basic_attack.msg_hit = ["The [name] flings a swarm of sparks.", "The [name] attacks."];
        this.basic_attack.msg_miss = ["The [name] misses."];
        this.basic_attack.range = 3;
        this.basic_attack.damage_type = GlobalConst.DAMAGE_TYPES.DIVINE;
        this.basic_attack.baseType = GlobalConst.DWELLER_ATTACK_TYPE.RANGED_MAGIC;

        this.special_attack_cooldown = 2;
        this.special_attack_description = "Blink. Frequently teleports.";
        //VARIATIONS
        this.setBaseDodge(DwellerData.BASE_DODGE * 1.2);
        this.setBaseHp(DwellerData.BASE_HP * 0.6);
        this.setBaseDef(DwellerData.BASE_DEF * 1);
        this.setBaseBlock(0);
        this.basic_attack.setBaseCrit(DwellerAttackData.BASE_CRIT * 1.2);
        this.basic_attack.setBaseHit(DwellerAttackData.BASE_HIT_BONUS * 1.2);
        this.basic_attack.setBaseDamage(
            DwellerAttackData.BASE_DAMAGE_MIN * 0.65,
            DwellerAttackData.BASE_DAMAGE_MAX * 0.65,
        );
    }

    CheckSpecialAttack(dweller: Dweller): boolean {
        if (RandomUtil.instance.percentChance(50)) {
            return false;
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
