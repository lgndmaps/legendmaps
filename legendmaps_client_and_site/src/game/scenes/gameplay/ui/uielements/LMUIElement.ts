import { Scene } from "phaser";
import AlignGrid from "../../../../util/alignGrid";
import { LMScene } from "../../../LMScene";
import { GameUI } from "../gameUI";

export default class LMUIElement {
    protected _container: Phaser.GameObjects.Container;
    protected scene: LMScene;
    public enabled: boolean = false; //used by interactive elements.

    constructor(scene: LMScene) {
        this.scene = scene;
        this._container = this.scene.add.container(0, 0);
        this.enabled = true;
    }

    public get container(): Phaser.GameObjects.Container {
        return this._container;
    }

    public placeInGrid(
        tileIndex: number,
        adjx: number = 0,
        adjy: number = 0,
        parentContainer: Phaser.GameObjects.Container = null,
    ) {
        this.scene.alignGrid.placeAtIndex(tileIndex, this._container, adjx, adjy, parentContainer);
        return this;
    }

    public setPosition(x: number, y: number) {
        this._container.setPosition(x, y);
    }

    public get x(): number {
        return this._container.x;
    }

    public get y(): number {
        return this._container.y;
    }

    public show() {
        this._container.setVisible(true);
        this._container.setActive(true);
    }

    public hide() {
        this._container.setVisible(false);
        this._container.setActive(false);
    }

    //only used by interactive elements
    public setEnabled(enabled: boolean) {
        this.enabled = enabled;
    }
}
