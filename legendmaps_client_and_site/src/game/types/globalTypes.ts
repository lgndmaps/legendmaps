//SHARED TYPES BETWEEN CLIENT & SERVER
import GlobalConst from "./globalConst";

/* #region CLIENT_MESSAGE */
/**
 * ===================================
 * TYPES USED TO SEND DATA TO CLIENT
 * ===================================
 */
export type M_Game = {
    turn: number;
    flags: number;
    map: M_Map;
    ents: M_Entity[];
    inv: M_InventoryItem[];
    charEffs: M_Effect[];
    turnEvents: M_TurnEvent[]; //chronological array of all turn events to "play back" on client
};

//BEGIN TURN EVENT MESSAGING
export type M_TurnEvent = {
    event: string; //Custom string to trigger/identify to client, use M_TurnEvent_Names.
    params: M_TurnEvent_Param; //(One of the Turn Event objects) for passing turn event data  to client
};

export enum M_TurnEvent_Names {
    MESSAGE = "MSG", //SIMPLE MESSAGE
    FX = "FX", //FX MESSAGE
    CLOSE_GATE = "CLOSE_GATE",
    GOLD_PICKUP = "GOLD_PICKUP",
    KEY_PICKUP = "KEY",

    USED_ITEM = "USED_ITEM",
    USED_ITEM_COMPLETE = "USED_ITEM_END",

    DWELLER_MOVE = "DWELLER_MOVE",
    DWELLER_KILLED = "DWELLER_KILLED",
    DWELLER_ATTACK = "DWELLER_ATTACK",
    DWELLER_SPECIAL = "DWELLER_SPEC",
    DWELLER_HP_EFFECT_TICK = "DWELLER_EFF",
    PLAYER_HP_EFFECT_TICK = "PLAYER_EFF",
    ATTACK_STEP = "ATTACK_STEP",
    ATTACK_RESULT = "ATTACK_RESULT", //Multiple of these get stacked after player or dweller attack
    ATTACK_COMPLETE = "ATTACK_COMPLETE",
    PLAYER_MOVE = "PLAYER_MOVE",
    PLAYER_DEAD = "PLAYER_DEAD",
    PLAYER_EXIT = "PLAYER_EXIT",
    PLAYER_ATTACK = "PLAYER_ATTACK",

    STORY_EVENT_KICKOFF = "STORY_EVENT_START",
    STORY_EVENT_OUTCOME = "STORY_EVENT_OUTCOME",

    MERCHANT_START = "MERCHANT_START",
    MERCHANT_UPDATE = "MERCHANT_UPD",
    TRAP_TRIGGER = "TRAP_TRIG",
}

export type M_TurnEvent_Param = {};

export type M_TurnEvent_Msg = M_TurnEvent_Param & {
    text: string;
    mflags: number;
};

export type M_TurnEvent_FX = M_TurnEvent_Param & {
    text: string;
    mflags: number;
    amount?: number;
    pc?: boolean;
    dwellers?: number[];
    fx: GlobalConst.CLIENTFX;
};

export type M_TurnEvent_HPEffectTick = M_TurnEvent_Param & {
    targetId: number;
    hpChange: number;
    hp: number;
    damType?: GlobalConst.DAMAGE_TYPES;
    flags: number; //ATTACK_FLAGS for vuln/imm/res
};

export type M_TurnEvent_UseItem = M_TurnEvent_Param & {
    itemId: number;
    dwellerId?: number;
    dwellerKind?: string;
    desc?: string;
    hp?: number;
    effects?: M_Effect[];
};

export type M_TurnEventAttackInit = M_TurnEvent_Param & {
    attackerId?: number;
    dwellerKind?: string; //only set if attacker is dweller
    flags?: number;
    weaponName: string;
    weaponType: string;
    primaryDamageType: string;
    attackerName: string;
    originTile: MapPosD;
    tiles: MapPosD[];
};

export type M_TurnEventAttackStep = M_TurnEvent_Param & {
    targetId?: number;
    dwellerKind?: string;
    targetName: string;
    tile: MapPosD;
    hitRoll: number;
    hitBonus: number;
    defense: number;
    flags: number;
};

export type M_TurnEvent_AttackResult = M_TurnEvent_Param & {
    flags: number;
    unmodifiedDamage?: number;
    finalDamage?: number;
    targetUpdate?: M_Dweller | M_Char;
    effect?: M_Effect;
};

export type M_TurnEvent_AttackComplete = M_TurnEvent_Param & {};

export type M_TurnEvent_DwellerSpecial = M_TurnEvent_Param & {
    id: number;
    kind: string;
    name: string;
    setupDesc: string;
    resultDesc: string;
    fx?: GlobalConst.CLIENTFX; //optional param for front end visual effect trigger type
};

export type M_TurnEvent_DwellerMove = M_TurnEvent_Param & {
    id: number;
    kind: string;
    name: string;
    x: number;
    y: number;
};

export type M_TurnEvent_DwellerKilled = M_TurnEvent_Param & {
    id: number;
    kind: string;
    name: string;
};

export type M_TurnEvent_PlayerMove = M_TurnEvent_Param & {
    x: number;
    y: number;
};

export type M_TurnEvent_PlayerDead = M_TurnEvent_Param & {
    deathMessage: string;
};

export type M_TurnEvent_PlayerEscape = M_TurnEvent_Param & {
    escapeMessage: string;
};

export type M_TurnEvent_InstantPickup = M_TurnEvent_Param & {
    amount: number;
    newtotal: number;
};

//END TURN EVENT MESSAGING

//BEGIN MAP, DWELLER, CHAR MESSAGING
export type M_Map = {
    sizeX: number;
    sizeY: number;
    tiles: M_Tile[]; //Not a 2d Array because we never send the whole map
};

export type M_Tile = {
    id: number;
    kind: string;
    x: number;
    y: number;
    ascii?: string;
    flags: number;
};

export type M_Entity = {
    id?: number;
    cname?: string;
    kind?: string;
    x?: number;
    y?: number;
    flags?: number;
};

export type M_Dweller = M_Entity & {
    name?: string;
    hp?: number;
    maxhp?: number;
    level?: number;
    conditions?: M_Condition[];
    phy?: string;
    def?: number;
    block?: number;
    dodge?: number;
    atk?: string;
    spec?: string;
    res?: string;
    imm?: string;
    vuln?: string;
};

export type M_Char = M_Entity & {
    level?: number;
    hp?: number;
    hpmax?: number;
    br?: number;
    ag?: number;
    gu?: number;
    sp?: number;
    hunger?: number;
    gold?: number;
    keys?: number;
    def?: number;
    dodge?: number;
    block?: number;
    first_name?: string;
    last_name?: string;
    full_name?: string;
    tokenId?: number;
    traits?: string[];
    skills?: string[];
    effects?: M_Effect[];
    conditions?: M_Condition[];
};

export type M_Merchant = M_Entity & {
    mgfx: string;
};

export type M_ItemMerchant = {
    price: number;
    item: M_Item;
};

export type M_MerchantReveal = M_TurnEvent_Param & {
    title: string;
    body: string;
    image: string;
    stealInfo: string;
    items: M_ItemMerchant[];
};

export type M_MerchantResponse = M_TurnEvent_Param & {
    text: string;
    closeAfter: boolean;
    stealInfo?: string;
    items?: M_ItemMerchant[];
};

export type M_StoryEvent = M_Entity & {
    mgfx: string;
};

export type M_StoryEventReveal = M_TurnEvent_Param & {
    title: string;
    body: string;
    key: string;
    options: M_StoryEventOption[];
};

export type M_StoryEventOption = {
    idx: number;
    text: string;
    hint: string;
};

export type M_StoryEventOutcome = {
    text: string;
    vfx?: string; //string to trigger visual effect on client
    isFinal?: boolean;
    effect?: EffectD;
};

export type M_TrapTrigger = {
    title: string;
    result: string;
    trap: GlobalConst.TRAP_TYPES;
    vfx?: string; //string to trigger visual effect on client
};

export type M_InventoryItem = Omit<InventoryItemD, "cname" | "item"> & Omit<ItemD, "cname"> & {};

export type M_Item = M_Entity & ItemD & {};

export type M_Effect = EffectD & {};

export type M_Condition = ConditionD & {
    desc: string;
};

export type M_Feature = M_Entity & {};

export type M_Door = M_Entity & {};
//END MAP, DWELLER, CHAR MESSAGING
/* #endregion */

/* #region DATABASE TYPES */
/**
 * ===================================
 * TYPES USED TO SAVE DATA FOR DB,
 * SOME ALSO USED BY MESSAGING SYSTEM
 *
 * These types are used for detailed data on objects
 * that will be saved in the database and session
 * these are mostly not sent to client since much info
 * is included there that client shouldnt/cant now.
 * But all are included here for consistency.
 * ===================================
 */

export type GameObjectD = {};

export type SaveObjectCoreD = GameObjectD & {
    id: number;
    kind: string;
    cname: string;
};

export type MapPosD = GameObjectD & {
    x: number;
    y: number;
};

export type MapRectD = GameObjectD & {
    origin: MapPosD;
    extents: MapPosD;
    bottomRight: MapPosD;
};

export type MapObjectCoreD = GameObjectD & {
    pos: MapPosD;
    ascii: string;
};

export type GameDataD = SaveObjectCoreD & {
    campaignId: number;
    tokenId: number;
    flags: number;
    seed: number;
    idcounter: number;
    turn: number;
    _map: GameMapD;
    _entities: Array<EntityD>;
    stats: StatRun;
};

export type StatRun = {
    turns: number;
    playerEscape: boolean;
    playerDeath: boolean;
    causeOfDeath?: StatPlayerDeath;
    dwellersKilled: StatDwellerKilled[];
    goldLooted: number;
    chestsOpened: number;
    trapsTriggered: number;
    potionsDrunk: number;
    scrollsRead: number;
    foodEaten: number;
    itemsLooted: number;
    itemsPurchased: number;
    storyEventsCompleted: number;
    mapTokenId: number;
};

export type StatCampaign = {
    0: (StatRun & { death?: StatPlayerDeath }) | null;
    1: (StatRun & { death?: StatPlayerDeath }) | null;
    2: (StatRun & { death?: StatPlayerDeath }) | null;
    3: (StatRun & { death?: StatPlayerDeath }) | null;
    4: (StatRun & { death?: StatPlayerDeath }) | null;
};

export type StatDwellerKilled = {
    kind: string;
    level: number;
};

export type StatPlayerDeath = {
    cause: GlobalConst.DAMAGE_SOURCE;
    killerName: string; //name of dweller/trap/event
    epitaph: string; //string sent to player describing cause of death.
};

/**
 * Map Types
 */
export type GameMapD = SaveObjectCoreD & {
    map: (MapTileD | "")[][];
    rooms: Array<MapRoomD>;
};

export type MapObjectD = SaveObjectCoreD & MapObjectCoreD & {};

export type MapTileD = SaveObjectCoreD &
    MapObjectCoreD & {
        flags: number;
    };

export type MapEntityD = SaveObjectCoreD &
    MapObjectCoreD & {
        flags: number;
    };

export type MapRoomD = SaveObjectCoreD & {
    rect: MapRectD;
    exits: Array<MapPosD>;
    specialRoom: string;
};

//Entity Types
export type EntityD = SaveObjectCoreD & {
    flags: number;
    mapEntity?: MapEntityD;
};

export type MapPortalD = SaveObjectCoreD &
    EntityD & {
        isOpen: boolean;
        type: GlobalConst.SPECIAL_TILE_TYPE;
    };

export type ItemD = SaveObjectCoreD &
    EntityD & {
        name: string;
        nameBase: string;
        slot: GlobalConst.EQUIPMENT_SLOT;
        rarity: GlobalConst.RARITY;
        cr?: number;
        uses?: number;
        effects?: EffectD[];
        cooldown?: number;
        ascii?: string;
        flags?: number;
        value: number;
        itemFlags?: number;
    };

export type InventoryItemD = SaveObjectCoreD & {
    item: ItemD;
    equippedslot: GlobalConst.EQUIPMENT_SLOT;
    index: number;
};

export type SourceD = {
    type: GlobalConst.SOURCE_TYPE;
    id?: number;
};

export type EffectD = SaveObjectCoreD & {
    name: string; //reference, possibly used in display
    type: GlobalConst.EFFECT_TYPES; //
    amount_base: number;
    trigger: GlobalConst.EFFECT_TRIGGERS; //determines when effect fires
    condition?: GlobalConst.CONDITION; //EFFECT_TRIGGER must be CONDITION_TRIGGER, which it is this must be set.
    amount_max?: number; //if max provided, amount becomes a random range, if not, just base
    bonus_dam_percent?: number; // for things like +20% dam vs Undead
    bonus_dam_dweller_type?: GlobalConst.DWELLER_PHYLUM; // for things like +20% dam vs Undead
    chance?: number; //if not set, 100
    turns?: number; //if not set or set to -1, infinite/perm
    damage_type?: GlobalConst.DAMAGE_TYPES;
    cooldown?: number; //for weapons/dwellers, how often can be applied
    source?: SourceD;
    range?: number; //used for weapons, scrolls, etc.
    aoe?: number; //used for weapons, scrolls, etc.
    flags?: number; //for any needed booleans
};

export type ConditionD = SaveObjectCoreD & {
    turns?: number;
    effects?: EffectD[];
    sources: SourceD[];
};

export type EntityLivingD = SaveObjectCoreD &
    EntityD & {
        defense: number;
        block: number;
        dodge: number;
        hp: number;
        damageBonusAdditive: number;
        tohit: number;
        range: number;
        crit: number;
        immunities: GlobalConst.DAMAGE_TYPES[];
        resistances: GlobalConst.DAMAGE_TYPES[];
        vulnerabilities: GlobalConst.DAMAGE_TYPES[];
        conditions?: ConditionD[];
        effects?: EffectD[];
    };

export type DwellerD = EntityLivingD & {
    level: number;
    state_name: string;
    turnsSinceLastAction: number;
    turnSpecialLastUsed: number;
    carriedItem?: ItemD;
};

export type CharacterD = EntityLivingD & {
    inventory: InventoryItemD[];
    hpmax: number;
    hunger: number;
    brawn: number;
    agility: number;
    spirit: number;
    guile: number;
    level: number;
    luck: number;
    gold: number;
    first_name: string;
    last_name: string;
    full_name: string;
    tokenId: number;
    traitIds: number[];
    skillIds?: number[];
    idcounter: number;
};

export type CharacterDExtended = CharacterD & {
    _hpmax: number;
    _hp: number;
    _brawn: number;
    _agility: number;
    _spirit: number;
    _guile: number;
    _luck: number;
};

export type SkillD = {
    id: number;
    name: string;
    description: string;
    minLevel: number;
    maxLevel: number;
    stackable: boolean;
    minStats?: {
        brawn?: number;
        agility?: number;
        guile?: number;
        spirit?: number;
    };
    modifiers?: {
        brawn?: number;
        agility?: number;
        guile?: number;
        spirit?: number;
        dodge?: number;
        block?: number;
        defense?: number;
        crit?: number;
        to_hit?: number;
        damage_add?: number;
        damage_mult?: number;
        custom?: number; // use as an all-purpose amount field for custom-implmented globalSkills, so we can centralize the data/constants in globalSkills.ts instead of hardcoding throughout
    };
    resistances?: GlobalConst.DAMAGE_TYPES[];
    immunities?: GlobalConst.DAMAGE_TYPES[];
    vulnerabilities?: GlobalConst.DAMAGE_TYPES[];
    requiredSkill?: number;
};

export type StoryEventD = SaveObjectCoreD &
    EntityD & {
        hasTriggered: boolean;
    };

export type MerchantD = SaveObjectCoreD &
    EntityD & {
        inventory: ItemD[];
        price_multiplier: number;
    };

export type TrapD = SaveObjectCoreD & EntityD & {};
/* #endregion */

/* #region inputmessages */
export type InputMessage = GameMessage | StateMessage;

export type StateMessage = {
    type: GlobalConst.GLOBAL_COMMAND_TYPE.GAME_STATE;
    commandMessageType?: StateCommandTypes;
    commandMessage: StateCommandMessages;
    commandParams?: GameStateParamsD;
};

export type GameStateParamsD = {
    //TODO: THis is really a debug type
    wipeData?: boolean;
    mapId?: number;
    adventurerId?: number;
    seed?: number;
};

export type GameMessage = {
    type: GlobalConst.GLOBAL_COMMAND_TYPE.INPUT;
    commandMessageType?: GlobalConst.GAME_COMMAND_TYPE;
};

export type GameMessageShop = GameMessage & {
    itemid: number;
    steal: boolean;
    close: boolean;
};

export type GameMessageWait = GameMessage & {};

export type GameMessageUse = GameMessage & {
    id: number;
    dwellerX?: number;
    dwellerY?: number;
    dwellerId?: number;
};

export type GameMessageEquip = GameMessage & {
    id: number;
    slot: GlobalConst.EQUIPMENT_SLOT;
    puton: boolean;
};

export type GameMessageDeleteItem = GameMessage & {
    id: number;
};

export type GameMessageMove = GameMessage & {
    dir: GlobalConst.MOVE_DIR;
};

export type GameMessageAttack = GameMessage & {
    tileX: number;
    tileY: number;
    weapondId: number;
};

export type GameMessageInteract = GameMessage & {
    tileX: number;
    tileY: number;
};

export type GameMessageStoryEventOption = GameMessage & {
    index: number;
};

export type StateCommandTypes = "";
export type InputMessageTypes = GlobalConst.GLOBAL_COMMAND_TYPE;
export type StateCommandMessages = "start run" | "start campaign" | "start" | "debugstart" | "end";

export const GameCommandEquip = {};

export const InvalidCommandResponse = {
    message: "Invalid command",
};

export const GameEndResponse = {
    message: "GameEnded",
};

export type Params_Game_Start_Debug = {
    wipeData: boolean;
    mapId: number;
    adventurerId: number;
    seed: number;
};
/* #endregion */
