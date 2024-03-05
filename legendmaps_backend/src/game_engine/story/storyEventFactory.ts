import StoryEventData from "./data/storyEventData";
import GlobalConst from "../types/globalConst";
import Game from "../game";
import StoryEvent from "./storyEvent";
import StoryEventTrashPile from "./data/events/sTrashPile";
import StoryEventFountain from "./data/events/sFountain";
import StoryEventChest from "./data/events/sChest";
import StoryEventGravestone from "./data/events/sGravestone";
import StoryEventTrapPit from "./data/events/sTrapPit";
import STORY_EVENT_CATEGORY = GlobalConst.STORY_EVENT_CATEGORY;
import ArrayUtil from "../utils/arrayUtil";
import RandomUtil from "../utils/randomUtil";
import ObjectUtil from "../utils/objectUtil";
import StoryEventTrapGas from "./data/events/sTrapGas";
import StoryEventTrapWeb from "./data/events/sTrapWeb";
import StoryEventTrapLightning from "./data/events/sTrapLightning";
import StoryEventTrapSpikedWall from "./data/events/sTrapSpikedWall";
import StoryEventNest from "./data/events/sNest";
import StoryEventAltar from "./data/events/sAltar";
import StoryEventRack from "./data/events/sRack";
import StoryEventStatue from "./data/events/sStatue";
import StoryEventStatueHell from "./data/events/sStatueHell";
import StoryEventCauldron from "./data/events/sCauldron";
import StoryEventBarrel from "./data/events/sBarrel";
import StoryEventChestAdvanced from "./data/events/sChestAdvanced";
import StoryEventTree from "./data/events/sTree";
import StoryEventPyramid from "./data/events/sPyramid";
import {ProbTable} from "../utils/probTable";
import ProbTableItem from "../utils/probTableItem";
import StoryEventDoor from "./data/events/sDoor";
import StoryEventDoorOpen from "./data/events/sDoorOpen";
import StoryEventDoorUnlocked from "./data/events/sDoorUnlocked";
import StoryEventDoorMagic from "./data/events/sDoorMagic";
import StoryEventDoorSecretH from "./data/events/sDoorSecret";
import StoryEventLostToad from "./data/events/sLostToad";
import StoryEventLostPunk from "./data/events/sLostPunk";
import StoryEventPortal from "./data/events/sPortal";
import StoryEventGoblinDice from "./data/events/sGoblinDice";
import StoryEventDoorSecret from "./data/events/sDoorSecretV";
import StoryEventDoorDamaged from "./data/events/sDoorDamaged";

export default class StoryEventFactory {
    storyEventData: Map<string, StoryEventData> = new Map();
    private storyEventProbTable: ProbTable<GlobalConst.STORY_EVENT_KEYS>;

    private static _instance: StoryEventFactory;
    public static get instance() {
        return this._instance || (this._instance = new this());
    }

    constructor() {
        this.storyEventData[GlobalConst.STORY_EVENT_KEYS.BASIC_CHEST] = new StoryEventChest();
        this.storyEventData[GlobalConst.STORY_EVENT_KEYS.ADV_CHEST] = new StoryEventChestAdvanced();
        this.storyEventData[GlobalConst.STORY_EVENT_KEYS.TRASH_PILE] = new StoryEventTrashPile();
        this.storyEventData[GlobalConst.STORY_EVENT_KEYS.MAGIC_FOUNTAIN] = new StoryEventFountain();
        this.storyEventData[GlobalConst.STORY_EVENT_KEYS.LOST_TOAD] = new StoryEventLostToad();
        this.storyEventData[GlobalConst.STORY_EVENT_KEYS.LOST_PUNK] = new StoryEventLostPunk();
        this.storyEventData[GlobalConst.STORY_EVENT_KEYS.GRAVESTONE] = new StoryEventGravestone();
        this.storyEventData[GlobalConst.STORY_EVENT_KEYS.TRAP_PIT] = new StoryEventTrapPit();
        this.storyEventData[GlobalConst.STORY_EVENT_KEYS.TRAP_GAS] = new StoryEventTrapGas();
        this.storyEventData[GlobalConst.STORY_EVENT_KEYS.TRAP_WEB] = new StoryEventTrapWeb();
        this.storyEventData[GlobalConst.STORY_EVENT_KEYS.TRAP_LIGHTNING] = new StoryEventTrapLightning();
        this.storyEventData[GlobalConst.STORY_EVENT_KEYS.TRAP_SPIKED_WALL] = new StoryEventTrapSpikedWall();
        this.storyEventData[GlobalConst.STORY_EVENT_KEYS.PORTAL] = new StoryEventPortal();
        this.storyEventData[GlobalConst.STORY_EVENT_KEYS.GOBLIN_DICE] = new StoryEventGoblinDice();
        this.storyEventData[GlobalConst.STORY_EVENT_KEYS.WASPNEST] = new StoryEventNest();
        this.storyEventData[GlobalConst.STORY_EVENT_KEYS.ALTAR] = new StoryEventAltar();
        this.storyEventData[GlobalConst.STORY_EVENT_KEYS.TORTURE] = new StoryEventRack();
        this.storyEventData[GlobalConst.STORY_EVENT_KEYS.STATUE] = new StoryEventStatue();
        this.storyEventData[GlobalConst.STORY_EVENT_KEYS.STATUE_HELL] = new StoryEventStatueHell();
        this.storyEventData[GlobalConst.STORY_EVENT_KEYS.CAULDRON] = new StoryEventCauldron();
        this.storyEventData[GlobalConst.STORY_EVENT_KEYS.BARREL] = new StoryEventBarrel();
        this.storyEventData[GlobalConst.STORY_EVENT_KEYS.TREE] = new StoryEventTree();
        this.storyEventData[GlobalConst.STORY_EVENT_KEYS.PYRAMID] = new StoryEventPyramid();
        this.storyEventData[GlobalConst.STORY_EVENT_KEYS.DOOR] = new StoryEventDoor();
        this.storyEventData[GlobalConst.STORY_EVENT_KEYS.DOOR_OPEN] = new StoryEventDoorOpen();
        this.storyEventData[GlobalConst.STORY_EVENT_KEYS.DOOR_UNLOCKED] = new StoryEventDoorUnlocked();
        this.storyEventData[GlobalConst.STORY_EVENT_KEYS.DOOR_MAGIC] = new StoryEventDoorMagic();
        this.storyEventData[GlobalConst.STORY_EVENT_KEYS.DOOR_SECRET_V] = new StoryEventDoorSecret();
        this.storyEventData[GlobalConst.STORY_EVENT_KEYS.DOOR_SECRET_H] = new StoryEventDoorSecretH();
        this.storyEventData[GlobalConst.STORY_EVENT_KEYS.DOOR_DAMAGED] = new StoryEventDoorDamaged();
        
        this.storyEventProbTable = new ProbTable<GlobalConst.STORY_EVENT_KEYS>();
        for (const d of ObjectUtil.EnumKeys(GlobalConst.STORY_EVENT_KEYS)) {
            let eventData = this.storyEventData[GlobalConst.STORY_EVENT_KEYS[d]];
            if (eventData != undefined && eventData.allowRandomSpawns) {
                this.storyEventProbTable.add(eventData.kind, eventData.randomSpawnWeight);
            }
        }
    }

    CreateStoryEvent(game: Game, kind: GlobalConst.STORY_EVENT_KEYS): StoryEvent {
        let s: StoryEvent = new StoryEvent(game, "", kind);
        return s;
    }

    CreateRandomStoryEvent(game: Game): StoryEvent {
        return this.CreateStoryEvent(game, this.storyEventProbTable.roll());
    }

    GetStoryEventData(kind: GlobalConst.STORY_EVENT_KEYS): StoryEventData {
        if (this.storyEventData[kind] == null) {
            throw new Error("Unknown story event: " + kind);
        }
        return this.storyEventData[kind];
    }
}
/*
;*******************;
--- EXAMPLE: LOCKED CHEST ---
;*******************;
[StoryEvent]
key = LockedChestBasic
isHidden = false;

[SEDLockedChest extends StoryEventData]
key = LockedChestBasic
category = InteractiveItem
subcategory = chest
titleCopy = "You find a locked wooden chest";
bodyCopy = "The chest is firmly locked, what do you want to do?"
prereqs = []; //none;
canRenter = true; //this is true because it will destroy itself once looted
onTrigger = undefined //no trigger


StoryEventOption[] =
1 = "Try to break the lock" hint: "Uses brawn, 55% chance" prereq: [SECBagsCheck requiredvalue: 12] [SEOChestSuccess] or [SEOChestBroken]
2 =  "Use a Key" hint: "Consume 1 key" prereq: [SECHasInventoryItemOfType key] [SEOChestSuccess]
3 = "Attempt to pick the lock" hint: "Uses guile, 60% chance" prereq: [SECBagsCheck requiredvalue: 14] [SEOChestSuccess] or [SEOChestJammed]
4 = "Use your training to pick the lock" hint: "Uses locksmith trait, 90% chance" [SECTraitCheck locksmith] [SEOChestSuccess] or [SEOChestJammed]
5 = "Leave it alone" {Exit}

SEOChestJammed = "The lock is hopelessly jammed" (disappears)
SEOChestBroken = "The chest shatters into pieces" (disappears)
SEOChestSuccess = "You open the chest! You find...[loot]" (disappears)
 */
