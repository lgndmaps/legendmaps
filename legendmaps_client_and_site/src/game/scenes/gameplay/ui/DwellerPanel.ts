import { LMScene } from "../../LMScene";
import { GameUI } from "./gameUI";
import LMUIElement from "./uielements/LMUIElement";
import DwellerPanelPortrait from "./DwellerPanelPortrait";
import Dweller from "../entities/Dweller";
import { ToolTipManager } from "./toolTipManager";

export default class DwellerPanel extends LMUIElement {
    static POS_X_BASE: number = 1260;
    static POS_Y_BASE: number = 0;
    static Y_SPACING: number = 188;

    private ui: GameUI;
    private dwellerPorts: DwellerPanelPortrait[] = [];

    public mode: "updateQueue" | "playerInput" = "playerInput";

    constructor(scene: LMScene, gameUI: GameUI) {
        super(scene);
        this.ui = gameUI;
        // this.ui.alignGrid.placeAtIndex(30, this.container);
    }

    public updateDwellers(newDwellers: Dweller[]) {
        let newList: DwellerPanelPortrait[] = [];
        for (let d = 0; d < this.dwellerPorts.length; d++) {
            this.dwellerPorts[d].gotFreshUpdate = false;
        }

        for (let i = 0; i < newDwellers.length; i++) {
            let found: boolean = false;
            for (let d = 0; d < this.dwellerPorts.length; d++) {
                if (this.dwellerPorts[d].id == newDwellers[i].id) {
                    newList.push(this.dwellerPorts[d]);
                    this.dwellerPorts[d].updateDweller(newDwellers[i]);
                    found = true;
                }
            }
            if (!found) {
                let dp: DwellerPanelPortrait = new DwellerPanelPortrait(this.scene, this.ui);
                dp.init(newDwellers[i]);
                newList.push(dp);
            }
        }
        for (let d = 0; d < this.dwellerPorts.length; d++) {
            if (!this.dwellerPorts[d].gotFreshUpdate) {
                this.dwellerPorts[d].container.destroy();
            }
        }
        this.dwellerPorts = newList;
        this.updateTweens();
        ToolTipManager.instance.Clear();
    }

    private GetPortById(id: number): DwellerPanelPortrait {
        for (let i = 0; i < this.dwellerPorts.length; i++) {
            if (this.dwellerPorts[i].id == id) {
                return this.dwellerPorts[i];
            }
        }
        return;
    }

    private updateTweens() {
        let py = DwellerPanel.POS_Y_BASE;
        for (let d = 0; d < this.dwellerPorts.length; d++) {
            let dp: DwellerPanelPortrait = this.dwellerPorts[d];
            dp.updateTween(py);
            py += DwellerPanel.Y_SPACING;
        }
    }

    moveToTop(id: number) {
        if (this.dwellerPorts.length <= 4) return;

        let alreadyVisible = true;
        for (let d = 0; d < this.dwellerPorts.length; d++) {
            if (this.dwellerPorts[d].id == id) {
                if (this.dwellerPorts[d].y > 700) {
                    alreadyVisible = false;
                }
            }
        }
        if (alreadyVisible) return;

        let newlist: DwellerPanelPortrait[] = [];
        for (let d = 0; d < this.dwellerPorts.length; d++) {
            if (this.dwellerPorts[d].id == id) {
                newlist.unshift(this.dwellerPorts[d]);
            } else {
                newlist.push(this.dwellerPorts[d]);
            }
        }
        this.dwellerPorts = newlist;
        this.updateTweens();
    }

    updateHP(id: number, hp: number) {
        this.GetPortById(id)?.updateHP(hp);
    }

    adjustHP(id: number, adjustAmount: number) {
        this.GetPortById(id)?.adjustHP(adjustAmount);
    }

    highlightHover(id: number) {
        this.GetPortById(id)?.highlightHover();
        if (this.mode == "playerInput") {
            this.moveToTop(id);
        }
    }

    highlightCombat(id: number) {
        this.GetPortById(id)?.highlightCombat();
        if (this.mode == "updateQueue") {
            this.moveToTop(id);
        }
    }

    highlightClear(id: number) {
        this.GetPortById(id)?.highlightClear();
    }

    highlightClearAll() {
        for (let i = 0; i < this.dwellerPorts.length; i++) {
            this.dwellerPorts[i].highlightClear();
        }
    }
}
