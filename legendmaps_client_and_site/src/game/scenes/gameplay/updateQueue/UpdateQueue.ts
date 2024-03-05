import {
    M_Char,
    M_Condition,
    M_Dweller,
    M_Effect,
    M_Entity,
    M_Game,
    M_InventoryItem,
    M_Item,
    M_Merchant,
    M_StoryEvent,
    M_TurnEvent,
    M_TurnEvent_Names,
} from "../../../types/globalTypes";
import TimeUtil from "../../../util/timeUtil";
import {GameScene} from "../GameScene";
import EntityManager from "../entities/EntityManager";
import Dweller from "../entities/Dweller";
import FlagUtil from "../../../util/flagUtil";
import GlobalConst from "../../../types/globalConst";
import {PlayerCharacter} from "../entities/PlayerCharacter";
import {Item} from "../entities/Item";
import {Effect} from "../entities/Effect";
import {StoryEventTrigger} from "../entities/StoryEventTrigger";
import TurnEventQueue from "./turnEventQueue";
import Condition from "../entities/Condition";
import {MapPortal} from "../entities/MapPortal";
import {gameStore} from "../../../../stores/RootStore";
import InputManager from "../InputManager";
import {Merchant} from "../entities/Merchant";
import {PHASER_DEPTH} from "../../../types/localConst";

export default class UpdateQueue {
    private static _instance: UpdateQueue;
    public static get instance() {
        return this._instance || (this._instance = new this());
    }

    events: TurnEventQueue;

    updates: M_Game[];
    gameScene: GameScene;

    private processing: boolean = false;

    constructor() {
        this.updates = [];
    }

    SetGameScene(gameScene: GameScene) {
        this.gameScene = gameScene;
        this.events = new TurnEventQueue(this.gameScene);
    }

    AddUpdate(update: M_Game): void {
        this.updates.push(update);
        this.CheckNext();
    }

    async CheckNext() {
        if (!this.processing && this.updates.length > 0) {
            await this.ProcessUpdate();
            if (this.gameScene != undefined) this.gameScene.ui.UpdateCharacterData();
        }
        this.gameScene.turnText.clearAppend();
        InputManager.instance.awaitingServerUpdate = false;
    }

    async ProcessUpdate(): Promise<void> {
        let updateObj: M_Game = this.updates.shift();
        if (updateObj == undefined) {
            throw new Error("trying to process null update");
        }
        this.processing = true;

        while (this.gameScene == undefined || this.gameScene.turnText == undefined) {
            console.log("awaiting game scene initialization");
            await TimeUtil.sleep(50); //waiting til interface is initialized
        }
        this.gameScene.ui.dwellerPanel.mode = "updateQueue";
        this.gameScene.map.ClearIndicators();
        this.gameScene.turn = updateObj.turn;
        this.gameScene.ui.turnText.text = "" + this.gameScene.turn;
        this.gameScene.map.ParseUpdate(updateObj.map);
        this.events.clear();

        this.prepareDwellersForTurnEvents(updateObj.ents);

        if (updateObj.turnEvents != null && updateObj.turnEvents.length > 0) {
            for (let i = 0; i < updateObj.turnEvents.length; i++) {
                let te: M_TurnEvent = updateObj.turnEvents[i];
                this.events.add(te.event as M_TurnEvent_Names, te.params);
            }
        }
        this.events.validate();
        //Run the event queue, awaiting each step
        await this.events.process();

        await this.updateEntities(updateObj.ents);

        if (updateObj.inv != undefined && updateObj.inv.length > 0) {
            this.updateInventory(updateObj.inv);
        }

        this.gameScene.map.Draw();
        this.gameScene.map.setDepth(PHASER_DEPTH.MAP);
        this.gameScene.map.UpdateIndicators();
        this.gameScene.map.CenterOnTile(this.gameScene.player.tile.x, this.gameScene.player.tile.y);
        this.gameScene.ui.dwellerPanel.updateDwellers(this.gameScene.activeDwellers);
        this.gameScene.ui.dwellerPanel.mode = "playerInput";
        this.processing = false;

        this.CheckNext();
    }

    updateInventory(invUpdate: Array<M_InventoryItem>) {
        this.gameScene.player.parseInventoryUpdate(invUpdate);
        this.gameScene.ui.charSheetInv.playerInventoryUpdated();
        this.gameScene.ui.weaponInfo.SetItem(this.gameScene.player.GetActiveWeapon());
    }

    prepareDwellersForTurnEvents(entUpdate: Array<M_Entity>) {
        for (let i = 0; i < entUpdate.length; i++) {
            let ent: M_Entity = entUpdate[i];
            if (ent.cname == "Dweller") {
                let dwellerEnt: M_Dweller = ent as M_Dweller;
                let dweller: Dweller = EntityManager.instance.GetOrCreateDweller(
                    dwellerEnt.id,
                    dwellerEnt.kind,
                    dwellerEnt.name,
                );
                dweller.prevTile = dweller.tile;
                dweller.pendingTile = this.gameScene.map.GetTile(dwellerEnt.x, dwellerEnt.y);
            }
        }
    }

    async updateEntities(entUpdate: Array<M_Entity>) {
        //Removing all dwellers from map so they can be replaced by entity update.
        //for (let i = 0; i < entUpdate.length; i++) {
        for (let i = 0; i < this.gameScene.activeDwellers.length; i++) {
            let ent: M_Entity = this.gameScene.activeDwellers[i];
            if (ent.cname == "Dweller") {
                let dwellerEnt: M_Dweller = ent as M_Dweller;
                let dweller: Dweller = EntityManager.instance.GetOrCreateDweller(
                    dwellerEnt.id,
                    dwellerEnt.kind,
                    dwellerEnt.name,
                );
                dweller.prevTile = null;
                dweller.pendingTile = null;
                dweller.RemoveFromTile();
            }
        }

        this.gameScene.activeDwellers = [];
        //end dweller clear, now update all entities including dwellers.

        for (let e: number = 0; e < entUpdate.length; e++) {
            let ent: M_Entity = entUpdate[e];

            if (ent.kind == PlayerCharacter.ENTITY_NAME) {
                //NOTE: This is mostly redundant with turn event updates, but is here to ensure consistency
                this.gameScene.player.receivedFirstUpdate = true;

                let charUpdate: M_Char = ent as M_Char;
                Object.assign(this.gameScene.player, charUpdate);

                //Rebuild Player Traits Array
                if (charUpdate.traits != undefined) {
                    this.gameScene.player.traits = [];
                    for (let fx = 0; fx < charUpdate.traits.length; fx++) {
                        this.gameScene.player.traits.push(charUpdate.traits[fx]);
                    }
                }

                this.gameScene.player.receivedFirstUpdate = true;
                //Rebuild Player Effects Array
                if (charUpdate.effects != undefined) {
                    this.gameScene.player.effects = [];
                    for (let fx = 0; fx < charUpdate.effects.length; fx++) {
                        let effData: M_Effect = charUpdate.effects[fx];
                        let eff: Effect = new Effect();
                        Object.assign(eff, effData);
                        this.gameScene.player.effects.push(eff);
                    }
                }

                //Rebuild Player Conditions Array
                if (charUpdate.conditions != undefined) {
                    this.gameScene.player.conditions = [];
                    for (let fx = 0; fx < charUpdate.conditions.length; fx++) {
                        let condDat: M_Condition = charUpdate.conditions[fx];
                        let c: Condition = new Condition();
                        Object.assign(c, condDat);
                        this.gameScene.player.conditions.push(c);
                    }
                }

                if (charUpdate.gold != null && charUpdate.gold > -1) {
                    this.gameScene.ui.goldText.text = "" + charUpdate.gold;
                    this.gameScene.player.gold = charUpdate.gold;
                }
                if (charUpdate.keys != null && charUpdate.keys > -1) {
                    this.gameScene.ui.keyText.text = "" + charUpdate.keys;
                    this.gameScene.player.keys = charUpdate.keys;
                }
                if (charUpdate.hp != null) {
                    this.gameScene.ui.adventurerPortrait.updateHP(charUpdate.hp, charUpdate.hpmax);
                }
                if (charUpdate.hunger != null) {
                    this.gameScene.ui.adventurerPortrait.updateHunger(charUpdate.hunger);
                }
                //console.log("about to send char update " + charUpdate.x + " , " + charUpdate.y);
                this.gameScene.player.MoveTo(this.gameScene.map.GetTile(charUpdate.x, charUpdate.y));
                this.gameScene.ui.UpdateCharacterData();
            } else if (ent.cname == "Item") {
                let itemEnt: M_Item = ent as M_Item;

                let item: Item = EntityManager.instance.GetOrCreateItem(itemEnt.id, itemEnt.kind, itemEnt.rarity);
                if (
                    FlagUtil.IsSet(ent.flags, GlobalConst.ENTITY_FLAGS.MARKED_FOR_REMOVAL) ||
                    itemEnt.x < 0 ||
                    itemEnt.y < 0
                ) {
                    EntityManager.instance.RemoveEntity(item);
                } else {
                    item.MoveTo(this.gameScene.map.GetTile(itemEnt.x, itemEnt.y));
                }
            } else if (ent.cname == "Dweller") {
                let dwellerEnt: M_Dweller = ent as M_Dweller;
                let dweller: Dweller = EntityManager.instance.GetOrCreateDweller(
                    dwellerEnt.id,
                    dwellerEnt.kind,
                    dwellerEnt.name,
                );

                if (dwellerEnt.phy != null) {
                    dweller.phy = dwellerEnt.phy;
                }
                if (dwellerEnt.block != null) {
                    dweller.block = dwellerEnt.block;
                }
                if (dwellerEnt.atk != null) {
                    dweller.atk = dwellerEnt.atk;
                }
                if (dwellerEnt.def != null) {
                    dweller.def = dwellerEnt.def;
                }
                if (dwellerEnt.dodge != null) {
                    dweller.dodge = dwellerEnt.dodge;
                }
                if (dwellerEnt.spec != null) {
                    dweller.spec = dwellerEnt.spec;
                }
                if (dwellerEnt.res != null) {
                    dweller.res = dwellerEnt.res;
                }
                if (dwellerEnt.vuln != null) {
                    dweller.vuln = dwellerEnt.vuln;
                }
                if (dwellerEnt.imm != null) {
                    dweller.imm = dwellerEnt.imm;
                }
                if (dwellerEnt.level >= 0) {
                    dweller.level = dwellerEnt.level;
                    // console.log("CR ---: " + gameStore.activeMapMeta.challengeRating);
                    //  console.log("DL ---: " + dweller.level);
                    if (dweller.level > Math.round(gameStore.activeMapMeta.challengeRating / 2)) {
                        console.log("BOSS");
                        dweller.isBoss = true;
                    }
                }

                if (
                    FlagUtil.IsSet(dwellerEnt.flags, GlobalConst.ENTITY_FLAGS.MARKED_FOR_REMOVAL) ||
                    dwellerEnt.x < 0 ||
                    dwellerEnt.y < 0
                ) {
                    EntityManager.instance.RemoveEntity(dweller);
                } else {
                    dweller.MoveTo(this.gameScene.map.GetTile(dwellerEnt.x, dwellerEnt.y));
                    if (dwellerEnt.hp != undefined) {
                        dweller.hp = dwellerEnt.hp;
                    }
                    if (dwellerEnt.maxhp != undefined) {
                        dweller.maxhp = dwellerEnt.maxhp;
                    }
                }
                this.gameScene.activeDwellers.push(dweller);
            } else if (ent.cname == "StoryEvent") {
                let storyEnt: M_StoryEvent = ent as M_StoryEvent;
                let story: StoryEventTrigger = EntityManager.instance.GetOrCreateStoryEventTrig(
                    storyEnt.id,
                    storyEnt.kind,
                    storyEnt.mgfx,
                );
                if (
                    FlagUtil.IsSet(storyEnt.flags, GlobalConst.ENTITY_FLAGS.MARKED_FOR_REMOVAL) ||
                    storyEnt.x < 0 ||
                    storyEnt.y < 0
                ) {
                    EntityManager.instance.RemoveEntity(story);
                } else {
                    story.MoveTo(this.gameScene.map.GetTile(storyEnt.x, storyEnt.y));
                }
            } else if (ent.cname == "Merchant") {
                let merchMsg: M_Merchant = ent as M_Merchant;
                let merch: Merchant = EntityManager.instance.GetOrCreateMerchant(
                    merchMsg.id,
                    merchMsg.kind,
                    merchMsg.mgfx,
                );
                if (
                    FlagUtil.IsSet(merchMsg.flags, GlobalConst.ENTITY_FLAGS.MARKED_FOR_REMOVAL) ||
                    merchMsg.x < 0 ||
                    merchMsg.y < 0
                ) {
                    EntityManager.instance.RemoveEntity(merch);
                } else {
                    merch.MoveTo(this.gameScene.map.GetTile(merchMsg.x, merchMsg.y));
                }
            } else if (ent.cname == "MapPortal") {
                let myent: MapPortal = EntityManager.instance.GetOrCreateMapPortal(ent.id, ent.kind);
                myent.kind = ent.kind;
                myent.MoveTo(this.gameScene.map.GetTile(ent.x, ent.y));
            }
        }
    }
}
