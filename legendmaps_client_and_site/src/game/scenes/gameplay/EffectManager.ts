import GlobalConst from "../../types/globalConst";
import { M_Effect } from "../../types/globalTypes";
import GameUtil from "../../util/gameUtil";
import Dweller from "./entities/Dweller";
import { PlayerCharacter } from "./entities/PlayerCharacter";
import { GameScene } from "./GameScene";
import { GameMapTile } from "./map/GameMapTile";
import { Floater } from "./ui/floater";
import StringUtil from "../../util/stringUtil";
import Condition from "./entities/Condition";
import EffectHitGeneric from "./effects/EffectHitGeneric";
import BloodSplatter from "./effects/BloodSplatter";

export default class EffectManager {
    public gameScene: GameScene;

    private static _instance: EffectManager;
    public static get instance() {
        return this._instance || (this._instance = new this());
    }

    public init(scene: GameScene) {
        this.gameScene = scene;
    }

    public ShowTickEffect(
        target: Dweller | PlayerCharacter,
        hpChange: number,
        newhp: number,
        damage_type?: GlobalConst.DAMAGE_TYPES,
        flags?: number,
    ) {
        //this.gameScene.descTextArea.show(msg, false);
        console.log("SHOWING TICK ON TARGET " + target.GetGraphicName());
        let tile: GameMapTile = target.GetCurrentTile();
        if (tile == null) {
            console.log("Tick effect on target but target does not have a valid tile location");
        } else {
            let pos: Phaser.Math.Vector2 = this.gameScene.map.GetTileScreenPosition(tile);
            new Floater(this.gameScene, "-" + hpChange + " " + damage_type, pos.x, pos.y, 0x339933);
            if (damage_type == GlobalConst.DAMAGE_TYPES.PIERCE || damage_type == GlobalConst.DAMAGE_TYPES.BLADE) {
                let eff = new BloodSplatter().Init(this.gameScene, tile).Play(GlobalConst.MOVE_DIR.SOUTH, 1);
            } else {
                let eff = new EffectHitGeneric().Init(this.gameScene, tile, 0);
                eff.damageType = damage_type;
                eff.Play();
            }
        }
    }

    public GetConditionDescription(condition: Condition) {
        let desc: string = condition.kind.toUpperCase() + ":" + condition.desc;
        // add turns/turns left for any timed effect
        if (condition.turns > 0) {
            desc += " for " + condition.turns + " turns";
        }
        desc += "\n";
        return desc;
    }

    public GetResVulnImmDescription(effects: M_Effect[]): string {
        let desc: string = "";
        let imm: GlobalConst.DAMAGE_TYPES[] = [];
        let vuln: GlobalConst.DAMAGE_TYPES[] = [];
        let res: GlobalConst.DAMAGE_TYPES[] = [];

        if (effects == undefined) {
            return desc;
        }
        for (const eff of effects) {
            if (eff.type == GlobalConst.EFFECT_TYPES.RESIST) {
                res.push(eff.damage_type);
            } else if (eff.type == GlobalConst.EFFECT_TYPES.VULNERABLE) {
                vuln.push(eff.damage_type);
            } else if (eff.type == GlobalConst.EFFECT_TYPES.IMMUNE) {
                imm.push(eff.damage_type);
            }
        }

        if (imm.length > 0) {
            imm = imm.sort();
            desc += "Immune to: ";
            for (const dt of imm.filter((item, i, ar) => ar.indexOf(item) === i)) {
                // for (const dt of imm) {
                desc += StringUtil.titleCase(dt) + ", ";
            }
            desc = desc.slice(0, -2);
            desc += "\n";
        }

        if (res.length > 0) {
            res = res.sort();
            desc += "Resistant to: ";
            for (const dt of res.filter((item, i, ar) => ar.indexOf(item) === i)) {
                desc += StringUtil.titleCase(dt) + ", ";
            }
            desc = desc.slice(0, -2);
            desc += "\n";
        }

        if (vuln.length > 0) {
            vuln = vuln.sort();
            desc += "Vulnerable to: ";
            for (const dt of vuln.filter((item, i, ar) => ar.indexOf(item) === i)) {
                desc += StringUtil.titleCase(dt) + ", ";
            }
            desc = desc.slice(0, -2);
            desc += "\n";
        }

        return desc;
    }

    public GetEffectDescription(effect: M_Effect): string {
        let desc: string = "";

        if (effect.chance > 0) {
            desc += effect.chance + "% chance of ";
        }
        if (effect.type == GlobalConst.EFFECT_TYPES.BLOCK) {
            desc += GameUtil.formatBonus(effect.amount_base) + "% to block.";
        } else if (effect.type == GlobalConst.EFFECT_TYPES.DAMAGE) {
            desc += effect.amount_base + "";
            if (effect.amount_max > effect.amount_base) {
                desc += "-" + effect.amount_max;
            }
            desc += " " + effect.damage_type.toLowerCase() + " damage";
        } else if (effect.type == GlobalConst.EFFECT_TYPES.DAMAGE_MODIFIER) {
            if (effect.bonus_dam_percent) {
                desc += GameUtil.formatBonus(effect.bonus_dam_percent) + "% damage";
            } else {
                desc += GameUtil.formatBonus(effect.amount_base) + " damage";
            }
            if (effect.bonus_dam_dweller_type) {
                desc += " vs. " + effect.bonus_dam_dweller_type;
            }
        } else if (effect.type == GlobalConst.EFFECT_TYPES.DEFENSE) {
            desc += GameUtil.formatBonus(effect.amount_base) + " to defense.";
        } else if (effect.type == GlobalConst.EFFECT_TYPES.DODGE) {
            desc += GameUtil.formatBonus(effect.amount_base) + "% to dodge.";
        } else if (effect.type == GlobalConst.EFFECT_TYPES.CRIT) {
            desc += GameUtil.formatBonus(effect.amount_base) + "% to crit";
        } else if (effect.type == GlobalConst.EFFECT_TYPES.TOHIT) {
            desc += GameUtil.formatBonus(effect.amount_base) + " to hit.";
            // } else if (effect.type == GlobalConst.EFFECT_TYPES.DOT) {
            //     desc += effect.amount_base + " " + effect.damage_type.toLowerCase() + "/turn";
        } else if (effect.type == GlobalConst.EFFECT_TYPES.MAXHP) {
            desc += GameUtil.formatBonus(effect.amount_base);
            if (effect.amount_max > effect.amount_base) {
                desc += "-" + effect.amount_max;
            }
            desc += " to Max HP";
        } else if (effect.type == GlobalConst.EFFECT_TYPES.LUCK) {
            desc += GameUtil.formatBonus(effect.amount_base) + " to luck";
        } else if (effect.type == GlobalConst.EFFECT_TYPES.RESIST) {
            desc += StringUtil.titleCase(effect.damage_type) + " resistance";
        } else if (effect.type == GlobalConst.EFFECT_TYPES.VULNERABLE) {
            desc += StringUtil.titleCase(effect.damage_type) + " vulnerability";
        } else if (effect.type == GlobalConst.EFFECT_TYPES.IMMUNE) {
            desc += StringUtil.titleCase(effect.damage_type) + " immunity";
        } else if (effect.type == GlobalConst.EFFECT_TYPES.BRAWN) {
            desc += GameUtil.formatAmount(effect) + " Brawn";
        } else if (effect.type == GlobalConst.EFFECT_TYPES.AGILITY) {
            desc += GameUtil.formatAmount(effect) + " Agility";
        } else if (effect.type == GlobalConst.EFFECT_TYPES.GUILE) {
            desc += GameUtil.formatAmount(effect) + " Guile";
        } else if (effect.type == GlobalConst.EFFECT_TYPES.SPIRIT) {
            desc += GameUtil.formatAmount(effect) + " Spirit";
        } else if (effect.type == GlobalConst.EFFECT_TYPES.HUNGER) {
            desc += effect.amount_base < 0 ? "Increases " : "Reduces ";
            desc += "hunger by " + effect.amount_base;
            if (effect.amount_max > effect.amount_base) {
                desc += "-" + effect.amount_max;
            }
        } else if (effect.type == GlobalConst.EFFECT_TYPES.HEAL) {
            desc += "Heal for " + effect.amount_base;
            if (effect.amount_max > effect.amount_base) {
                desc += "-" + effect.amount_max;
            }
            desc += " hp";
        } else if (effect.type == GlobalConst.EFFECT_TYPES.SPELL) {
            desc += "Casts " + effect.name + " spell.";
        } else if (effect.type == GlobalConst.EFFECT_TYPES.GIVES_CONDITION) {
            desc += "Gives condition: " + StringUtil.titleCase(effect.condition);
        } else {
            // sensible catch-all
            desc += "UNPARSED EFFECT: " + effect.type + " ";
            desc += GameUtil.formatBonus(effect.amount_base);
        }
        // add turns/turns left for any timed effect
        if (effect.turns > 0) {
            desc += " for " + effect.turns + " turns";
        }
        return desc;
    }
    GetAggregatedEffectsDescriptions(effects: M_Effect[], rvi: boolean = false): string {
        // set rvi boolean = true if you want to include Resist/Vuln/Immune here
        // Useful to have a rolled up view with aggregated effects? e.g. Defense: +25 instead of a Defense +10 and a +15
        let desc: string = "";
        let aggEffs: M_Effect[] = [];

        if (effects == undefined) {
            return desc;
        }
        for (const eff of effects) {
            // skip res/vuln/imm effects if rvi is false
            if (
                !rvi &&
                (eff.type == GlobalConst.EFFECT_TYPES.RESIST ||
                    eff.type == GlobalConst.EFFECT_TYPES.IMMUNE ||
                    eff.type == GlobalConst.EFFECT_TYPES.VULNERABLE) &&
                (!eff.turns || eff.turns < 1)
            ) {
                continue;
            }
            // try merge
            aggEffs = EffectManager.MergeEffectIntoEffectArray(eff, aggEffs);
        }

        for (const eff of aggEffs) {
            desc += this.GetEffectDescription(eff) + "\n";
        }

        return desc;
    }

    private static MergeEffectIntoEffectArray(new_eff: M_Effect, effects: M_Effect[]) {
        // Merge a new effect into existing effects array where possible

        let tempEffects: M_Effect[] = [];
        //clone the effects array into tempEffects
        for (const eff of effects) {
            let tempEffect = {};
            Object.assign(tempEffect, eff);
            tempEffects.push(tempEffect as M_Effect);
        }

        let effMerged: boolean = false;
        if (new_eff.type == GlobalConst.EFFECT_TYPES.DAMAGE) {
            let cur_effs: M_Effect[] = this.FilterEffectsListByType(tempEffects, new_eff.type);
            for (const cur_eff of cur_effs) {
                if (
                    cur_eff.damage_type == new_eff.damage_type &&
                    cur_eff.range == new_eff.range &&
                    cur_eff.chance == new_eff.chance &&
                    cur_eff.trigger == new_eff.trigger &&
                    cur_eff.turns == new_eff.turns
                ) {
                    cur_eff.amount_base += new_eff.amount_base;
                    cur_eff.amount_max += new_eff.amount_max;
                    effMerged = true;
                }
            }
        } else if (
            new_eff.type == GlobalConst.EFFECT_TYPES.CRIT ||
            new_eff.type == GlobalConst.EFFECT_TYPES.BLOCK ||
            new_eff.type == GlobalConst.EFFECT_TYPES.DEFENSE ||
            new_eff.type == GlobalConst.EFFECT_TYPES.DODGE ||
            new_eff.type == GlobalConst.EFFECT_TYPES.HEAL ||
            new_eff.type == GlobalConst.EFFECT_TYPES.BRAWN ||
            new_eff.type == GlobalConst.EFFECT_TYPES.AGILITY ||
            new_eff.type == GlobalConst.EFFECT_TYPES.GUILE ||
            new_eff.type == GlobalConst.EFFECT_TYPES.SPIRIT ||
            new_eff.type == GlobalConst.EFFECT_TYPES.HUNGER ||
            new_eff.type == GlobalConst.EFFECT_TYPES.MAXHP
        ) {
            let cur_effs: M_Effect[] = this.FilterEffectsListByType(tempEffects, new_eff.type);

            for (const cur_eff of cur_effs) {
                if (
                    cur_eff.chance == new_eff.chance &&
                    cur_eff.trigger == new_eff.trigger &&
                    cur_eff.turns == new_eff.turns
                ) {
                    cur_eff.amount_base += new_eff.amount_base;
                    cur_eff.amount_max += new_eff.amount_max;
                    // console.log("combining " + new_eff.type + " effect on " + this.name);
                    effMerged = true;
                }
            }
        } else if (
            new_eff.type == GlobalConst.EFFECT_TYPES.VULNERABLE ||
            new_eff.type == GlobalConst.EFFECT_TYPES.RESIST ||
            new_eff.type == GlobalConst.EFFECT_TYPES.IMMUNE
        ) {
            let cur_effs: M_Effect[] = this.FilterEffectsListByType(tempEffects, new_eff.type);
            for (const cur_eff of cur_effs) {
                if (
                    cur_eff.damage_type == new_eff.damage_type &&
                    cur_eff.chance == new_eff.chance &&
                    cur_eff.trigger == new_eff.trigger &&
                    cur_eff.turns == new_eff.turns
                ) {
                    // duplicate res/vuln/imm, can skip
                    effMerged = true;
                }
            }
        }

        // if the new effect wasn't already merged into an existing effect, add it
        if (!effMerged) tempEffects.push(new_eff);

        return tempEffects;
    }
    static FilterEffectsListByType(effects: M_Effect[], type: GlobalConst.EFFECT_TYPES): M_Effect[] {
        let new_effs: M_Effect[] = [];
        for (let i = 0; i < effects.length; i++) {
            if (effects[i].type == type) {
                new_effs.push(effects[i]);
            }
        }
        return new_effs;
    }

    static FilterEffectListByTrigger(effects: M_Effect[], trigger: GlobalConst.EFFECT_TRIGGERS): M_Effect[] {
        let new_effs: M_Effect[] = [];
        for (let i = 0; i < effects.length; i++) {
            if (effects[i].trigger == trigger) {
                new_effs.push(effects[i]);
            }
        }
        return new_effs;
    }
}
