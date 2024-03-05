import { SaveObjectCoreD, StatDwellerKilled, StatPlayerDeath, StatRun } from "./types/globalTypes";
import Game from "./game";
import SerializableGameObject from "./base_classes/serializableGameObject";
import GlobalConst from "./types/globalConst";

export default class GameStats implements StatRun {
    causeOfDeath?: StatPlayerDeath;
    dwellersKilled: StatDwellerKilled[] = [];
    chestsOpened: number = 0;
    foodEaten: number = 0;
    goldLooted: number = 0;
    itemsLooted: number = 0;
    itemsPurchased: number = 0;
    playerDeath: boolean = false;
    playerEscape: boolean = false;
    potionsDrunk: number = 0;
    scrollsRead: number = 0;
    storyEventsCompleted: number = 0;
    trapsTriggered: number = 0;
    turns: number = 0;
    mapTokenId: number = 0;
    constructor(json?: StatRun) {
        if (json != undefined) {
            Object.assign(this, json);
        }
    }

    PlayerDied(turn: number, killerType: GlobalConst.DAMAGE_SOURCE, name: string, epitaphText: string) {
        this.playerDeath = true;
        this.turns = turn;
        this.causeOfDeath = {
            cause: killerType,
            epitaph: epitaphText,
            killerName: name,
        } as StatPlayerDeath;
    }

    PlayerWon(turn: number) {
        this.playerEscape = true;
        this.turns = turn;
    }

    DwellerKilled(dwellerKind: GlobalConst.DWELLER_KIND, dwellerLevel: number) {
        let d: StatDwellerKilled = {
            kind: dwellerKind as string,
            level: dwellerLevel,
        } as StatDwellerKilled;
        this.dwellersKilled.push(d);
    }
}
