import { LMScene } from "../../LMScene";
import { LMMeter } from "./uielements/LMMeter";
import LMUIElement from "./uielements/LMUIElement";

export default class AdventurerPortrait extends LMUIElement {
    private portrait: Phaser.GameObjects.Image;
    private healthBar: LMMeter;
    private hungerBar: LMMeter;
    private strokeSize: number = 1;
    private meterPadding: number = 10;
    private _hp: number;
    private _maxHp: number;
    private portSize: number;
    constructor(scene: LMScene, size: number = 225) {
        super(scene);
        this.portSize = size;
        this.init();
    }

    init() {
        this.portrait = this.scene.add.sprite(0, 0, "adventurer_portrait").setOrigin(0, 0);
        this.portrait.setScale(this.portSize / this.portrait.width);

        this.healthBar = new LMMeter(this.scene, this.portSize + this.strokeSize * 2, 20, 0xff1f00, 6);
        this.healthBar.setPosition(0, this.portSize + this.meterPadding);

        this.hungerBar = new LMMeter(this.scene, this.portSize + this.strokeSize * 2, 20, 0xe2d007, 6);
        this.hungerBar.setPosition(0, this.portSize + this.meterPadding + 27);

        this._container.add([this.portrait, this.healthBar.container, this.hungerBar.container]);
    }

    updateHP(hp: number, maxHp?: number) {
        this._hp = hp;
        if (maxHp != null) this._maxHp = maxHp;
        this.healthBar.setHP(this._hp, this._maxHp);
    }

    updateHunger(hunger: number, maxHunger: number = 100) {
        this.hungerBar.setFillPercent(hunger / maxHunger);
        if (hunger > 99) {
            this.hungerBar.setLabel("STUFFED");
        } else if (hunger > 50) {
            this.hungerBar.setLabel("SATED");
        } else if (hunger >= 10) {
            this.hungerBar.setLabel("PECKISH");
        } else if (hunger < 10) {
            this.hungerBar.setLabel("HUNGRY");
        } else if (hunger < 1) {
            this.hungerBar.setLabel("STARVING");
        }
    }
}
