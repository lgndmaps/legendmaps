import * as fs from "fs";
import type Game from "../../game";
import Item from "../item";
import GlobalConst from "../../types/globalConst";
import ItemGenCommon from "./itemGenCommon";
import GameUtil from "../../utils/gameUtil";

export default class ItemTests {
    static async RunTests(game: Game) {
        // this.WeaponTests(game);
        // this.ArmorTests(game);
    }

    static async WeaponTests(game: Game) {
        let runs: number = 100;
        let output: string = "";
        const weapon_types = [
            GlobalConst.ITEM_BASE_TYPE.SWORD,
            GlobalConst.ITEM_BASE_TYPE.BOW,
            GlobalConst.ITEM_BASE_TYPE.AXE,
            GlobalConst.ITEM_BASE_TYPE.DAGGER,
            GlobalConst.ITEM_BASE_TYPE.HAMMER,
            GlobalConst.ITEM_BASE_TYPE.SPEAR,
            GlobalConst.ITEM_BASE_TYPE.STAFF,
            GlobalConst.ITEM_BASE_TYPE.WAND,
        ];

        // iterate through each CR
        for (let cr = 1; cr < 6; cr++) {
            // iterate through each rarity
            for (let rarity = 0; rarity < 5; rarity++) {
                output += "CR: " + cr + " -- ";
                output += "Rarity: " + GameUtil.GetRarityString(GameUtil.GetRarityFromNumber(rarity)) + "\n";

                output += "----------\n";

                let totalDamage = 0;
                output += "weapon type\t avg dam\t value\n";

                // iterate through each weapon type
                for (const weapon_type of weapon_types) {
                    let totalTypeDamage: number = 0;
                    let totalTypeValue: number = 0;
                    output += weapon_type + " \t\t ";
                    for (let index = 0; index < runs; index++) {
                        let item: Item = ItemGenCommon.GenerateItem(
                            game,
                            weapon_type,
                            GameUtil.GetRarityFromNumber(rarity),
                            cr,
                        );
                        totalTypeDamage += item.AverageDamagePerTurn();
                        totalTypeValue += item.value;
                    }
                    // show min, max, average damage,

                    output += (totalTypeDamage / runs).toFixed(2) + "\t\t";
                    output += (totalTypeValue / runs).toFixed(0) + "\n";

                    totalDamage += totalTypeDamage;
                }
                output +=
                    "\nAvg Damage All Weapon Types (CR: " +
                    cr +
                    ", rarity: " +
                    GameUtil.GetRarityString(GameUtil.GetRarityFromNumber(rarity)) +
                    "): " +
                    (totalDamage / runs / weapon_types.length).toFixed(2);
                output += "\n------------\n\n";
            }
        }
        console.log(output);
        await fs.writeFile(__dirname + "/weaponTest.txt", output, "utf8", () => {});
    }

    static async ArmorTests(game: Game) {
        let runs: number = 100;
        let output: string = "";
        const armor_types = [
            GlobalConst.ITEM_BASE_TYPE.ROBES,
            GlobalConst.ITEM_BASE_TYPE.ARMOR_LIGHT,
            GlobalConst.ITEM_BASE_TYPE.ARMOR_HEAVY,
            GlobalConst.ITEM_BASE_TYPE.BOOTS,
            GlobalConst.ITEM_BASE_TYPE.HAT,
            GlobalConst.ITEM_BASE_TYPE.HELM,
            GlobalConst.ITEM_BASE_TYPE.SHIELD,
        ];

        // iterate through each CR
        for (let cr = 1; cr < 6; cr++) {
            // iterate through each rarity
            for (let rarity = 0; rarity < 5; rarity++) {
                output += "CR: " + cr + " -- ";
                output += "Rarity: " + GameUtil.GetRarityString(GameUtil.GetRarityFromNumber(rarity)) + "\n";

                output += "----------\n";

                let totalDefense: number = 0;
                let totalBlock: number = 0;
                let totalDodge: number = 0;
                output += "armor type\t defense\t block\t\t dodge \t\t value\n";

                // iterate through each armor type
                for (const armor_type of armor_types) {
                    let totalTypeDefense: number = 0;
                    let totalTypeBlock: number = 0;
                    let totalTypeDodge: number = 0;
                    let totalTypeValue: number = 0;
                    output += armor_type + ":\t\t ";
                    for (let index = 0; index < runs; index++) {
                        let item: Item = ItemGenCommon.GenerateItem(
                            game,
                            armor_type,
                            GameUtil.GetRarityFromNumber(rarity),
                            cr,
                        );
                        totalTypeDefense += item.GetTotalOfEffectsByType(GlobalConst.EFFECT_TYPES.DEFENSE);
                        totalTypeBlock += item.GetTotalOfEffectsByType(GlobalConst.EFFECT_TYPES.BLOCK);
                        totalTypeDodge += item.GetTotalOfEffectsByType(GlobalConst.EFFECT_TYPES.DODGE);
                        totalTypeValue += item.value;
                    }
                    // show min, max, average damage,
                    output += (totalTypeDefense / runs).toFixed(2) + "\t\t ";
                    output += (totalTypeBlock / runs).toFixed(2) + "\t\t ";
                    output += (totalTypeDodge / runs).toFixed(2) + "\t\t";
                    output += (totalTypeValue / runs).toFixed(0) + "\n";

                    totalDefense += totalTypeDefense;
                    totalBlock += totalTypeBlock;
                    totalDodge += totalTypeDodge;
                }
                // output +=
                //     "\nAvg Stats All Armor Types (CR: " +
                //     cr +
                //     ", rarity: " +
                //     GameUtil.GetRarityString(GameUtil.GetRarityFromNumber(rarity)) +
                //     "): \n";
                // output += "Def: " + (totalDefense / runs / armor_types.length).toFixed(2) + " \n ";
                // output += "Block: " + (totalBlock / runs / armor_types.length).toFixed(2) + " \n ";
                // output += "Dodge: " + (totalDodge / runs / armor_types.length).toFixed(2) + "\n";

                output += "\n------------\n\n";
            }
        }
        console.log(output);
        await fs.writeFile(__dirname + "/armorTest.txt", output, "utf8", () => {});
    }

    static async ValueTest(game: Game) {
        let runs: number = 1000;
        let output: string = "";
        for (let index = 0; index < runs; index++) {
            let i: Item = ItemGenCommon.GenerateRandomItem(game, 2, GlobalConst.RARITY.RARE);
            ItemGenCommon.UpdateValue(i);
            output += `${i.name},${i.rarity},${i.cr},${i.value}\n`;
        }
        await fs.writeFile(__dirname + "/itemTest.csv", output, "utf8", () => {});
        // let i: Item = this.GenerateItem(game, GlobalConst.ITEM_BASE_TYPE.SWORD, GlobalConst.RARITY.RARE, 2);
        // this.AddEnhancementById(GlobalConst.ITEM_ENHANCEMENTS.DAMAGE_COLD, i);
        // this.UpdateValue(i);
        // console.log(`${i.name},${i.rarity},${i.cr},${i.value}\n`);
    }
}
