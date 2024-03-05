import { LMScene } from "../../../LMScene";
import LMUIElement from "./LMUIElement";
import gameConfig from "../../gameConfig.json";
import {FONT} from "../../../../types/localConst";

export class WeaponBox extends LMUIElement {
    private icon: Phaser.GameObjects.Image;
    private label: Phaser.GameObjects.BitmapText;
    private weapon: Phaser.GameObjects.BitmapText;

    constructor(scene: LMScene, labelText: string, weaponName: string, weaponIcon: string) {
        super(scene);
        this.icon = scene.add
            .image(0, 0, "maptiles", weaponIcon)
            .setOrigin(0, 0)
            .setScale(40 / gameConfig.tileSize);
        this.label = scene.add.bitmapText(50, 0, FONT.BODY_24, labelText).setOrigin(0, 0).setLeftAlign();
        this.weapon = scene.add.dynamicBitmapText(50, 20, FONT.BODY_24, weaponName).setOrigin(0, 0).setLeftAlign();
        this._container.add([this.label, this.weapon, this.icon]);
    }

    public setIcon(weaponIcon: string) {
        this.icon.setFrame(weaponIcon);
    }

    public setWeapon(weaponName: string) {
        this.weapon.text = weaponName;
    }
}
