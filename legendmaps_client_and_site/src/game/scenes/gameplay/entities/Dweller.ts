import { EntityLiving } from "./EntityLiving";
import { GameMapTile } from "../map/GameMapTile";
import FXDwellerGhost from "../fx/fxDwellerGhost";
import { GameScene } from "../GameScene";

export default class Dweller extends EntityLiving {
    name: string = "";
    maxhp: number = 1;
    level: number = -1;
    phy?: string;
    def?: number;
    block?: number;
    dodge?: number;
    atk?: string;
    spec?: string;
    res?: string;
    imm?: string;
    vuln?: string;
    isBoss: boolean = false;
    isDead: boolean = false;

    prevTile: GameMapTile; //holds last tile updated
    pendingTile: GameMapTile; //tile this dweller is destined to move to in current update.

    constructor(kind: string, name: string) {
        super();
        this.kind = kind;
        this.name = name;
    }

    MoveTo(newTile: GameMapTile) {
        super.MoveTo(newTile);
    }

    CreateMoveGhost(scene: GameScene) {
        if (this.tile != undefined) {
            new FXDwellerGhost(scene, this, this.tile);
        }
    }

    GetGraphicName(): string {
        return "dw_" + this.kind + ".png";
    }

    GetPortraitName(): string {
        return "dwp_" + this.kind + ".png";
    }
}
