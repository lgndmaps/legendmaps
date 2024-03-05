import CommandManager from "../CommandManager";
import {GameScene} from "../GameScene";
import {LMButtonText} from "./uielements/LMButtonText";
import gameConfig from "../gameConfig.json";
import AlignGrid from "../../../util/alignGrid";
import {CharacterSheetStats} from "./CharacterSheet/CharacterSheetStats";
import {InputController} from "../../../types/frontendTypes";
import {Geom} from "phaser";
import InputManager from "../InputManager";
import GlobalConst from "../../../types/globalConst";
import {GameMapTile} from "../map/GameMapTile";
import InventoryItem from "../entities/InventoryItem";
import {FONT, PHASER_DEPTH} from "../../../types/localConst";
import {ToolTipManager} from "./toolTipManager";
import Dweller from "../entities/Dweller";
import StoryEventModal from "../story/StoryEventModal";
import {M_MerchantReveal, M_StoryEventReveal} from "../../../types/globalTypes";
import DwellerPanel from "./DwellerPanel";
import AdventurerPortrait from "./AdventurerPortrait";
import ButtonPanel from "./buttonPanel";
import {LMModalConfirm} from "./uielements/LMModalConfirm";
import {MapInfo} from "./MapInfo";
import GeneralModal from "./generalModal";
import MerchantModal from "../merchant/MerchantModal";
import {ItemUseTargetUI} from "./ItemUseTargetUI";
import {CharacterSheetInventory} from "./CharacterSheet/CharacterSheetInventory";
import {KeyboardAttackUI} from "./KeyboardAttackUI";
import {WeaponInfo} from "./uielements/WeaponInfo";
import TimeUtil from "../../../util/timeUtil";

export class GameUI extends Phaser.GameObjects.Container implements InputController {
    private gameScene: GameScene;
    //public adventurerName: Phaser.GameObjects.BitmapText;
    public adventurerPortrait: AdventurerPortrait;
    public keyText: Phaser.GameObjects.DynamicBitmapText;
    public goldText: Phaser.GameObjects.DynamicBitmapText;
    public turnText: Phaser.GameObjects.DynamicBitmapText;
    public btnSheet: LMButtonText;
    public btnStats: LMButtonText;
    private waitBtn: LMButtonText;

    public contEventLog: Phaser.GameObjects.Container;
    public eventLogText: Phaser.GameObjects.DynamicBitmapText;

    public charSheetStats: CharacterSheetStats;
    public charSheetInv: CharacterSheetInventory;
    public storyEventModal: StoryEventModal;
    public merchantModal: MerchantModal;
    public generalModal: GeneralModal;

    public contDeath: Phaser.GameObjects.Container;

    public alignGrid: AlignGrid;

    public blockInput: boolean = false;

    public dwellerPanel: DwellerPanel;

    private activeDwellerHover: Dweller;

    public buttonPanel: ButtonPanel;
    public weaponInfo: WeaponInfo;

    public confirmModal: LMModalConfirm;

    public mapInfo: MapInfo;

    public itemUseTargetUI: ItemUseTargetUI;
    public keyboardAttackUI: KeyboardAttackUI;

    constructor(gameScene: GameScene) {
        super(gameScene);
        this.gameScene = gameScene;
        this.scene.children.add(this);
    }

    Initialize() {
        this.alignGrid = this.gameScene.alignGrid;

        let rectbg: Phaser.GameObjects.Rectangle = this.scene.add
            .rectangle(-2, -2, 234, 760, 0xff000000, 0)
            .setOrigin(0, 0);
        this.add(rectbg);

        let rect: Phaser.GameObjects.Rectangle = this.scene.add
            .rectangle(-2, -2, 234, 600, 0x00000000, 0)
            .setOrigin(0, 0);
        rect.setStrokeStyle(1, 0x555555, 1);
        this.add(rect);

        this.adventurerPortrait = new AdventurerPortrait(this.gameScene).placeInGrid(0, 0, 0);

        this.weaponInfo = new WeaponInfo(this.gameScene);
        this.add(this.weaponInfo.container);
        this.weaponInfo.setPosition(7, 290);

        this.add(this.scene.add.image(25, 384, "ui", "glass.png").setOrigin(0.5, 0.5));
        this.turnText = this.scene.add
            .dynamicBitmapText(38, 384, FONT.BODY_20, "0")
            .setOrigin(0, 0.5)
            .setLeftAlign()
            .setLetterSpacing(-1);
        this.add(this.turnText);

        this.add(this.scene.add.image(92, 384, "ui", "icon_key.png").setOrigin(0.5, 0.5));
        this.keyText = this.scene.add
            .dynamicBitmapText(109, 384, FONT.BODY_20, "0")
            .setOrigin(0, 0.5)
            .setLeftAlign()
            .setLetterSpacing(-1);
        this.add(this.keyText);

        this.add(this.scene.add.image(160, 384, "ui", "icon_gold.png").setOrigin(0.5, 0.5));
        this.goldText = this.scene.add
            .dynamicBitmapText(179, 384, FONT.BODY_20, "0,000")
            .setOrigin(0, 0.5)
            .setLeftAlign()
            .setLetterSpacing(-1);
        this.add(this.goldText);


        this.btnSheet = new LMButtonText(
            this.gameScene,
            "Inventory",
            new Phaser.Math.Vector2(150, 38),
            new Phaser.Math.Vector2(40, 410),
            this.OpenCharSheet.bind(this),
            "icon_bottle_24.png",
        );

        this.add(this.btnSheet.container);

        this.btnStats = new LMButtonText(
            this.gameScene,
            "Adventurer",
            new Phaser.Math.Vector2(150, 38),
            new Phaser.Math.Vector2(40, 455),
            this.OpenCharSheetStats.bind(this),
            "icon_player.png",
        );

        this.add(this.btnStats.container);


        this.waitBtn = new LMButtonText(
            this.gameScene,
            "Wait",
            new Phaser.Math.Vector2(150, 38),
            new Phaser.Math.Vector2(40, 500),
            this.CommandWait.bind(this),
            "icon_hand_24.png",
        );
        this.add(this.waitBtn.container);

        this.charSheetStats = new CharacterSheetStats(this.gameScene, this);
        this.charSheetInv = new CharacterSheetInventory(this.gameScene, this);
        this.storyEventModal = new StoryEventModal(this.gameScene, this);
        this.merchantModal = new MerchantModal(this.gameScene, this);
        this.generalModal = new GeneralModal(this.gameScene, this);
        // this.contTopRight = this.scene.add.container(1150, 0);

        this.buttonPanel = new ButtonPanel(this.gameScene, this);
        this.buttonPanel.container.setDepth(PHASER_DEPTH.GAME_UI);

        this.contEventLog = this.scene.add.container(230, 0);
        this.contEventLog.add(
            this.scene.add.rectangle(0, 0, 850, 755, 0x000000, 1).setOrigin(0, 0).setStrokeStyle(1, 0xffffffff, 1),
        );
        this.eventLogText = this.scene.add
            .dynamicBitmapText(10, 10, FONT.BODY_24, "0", 24)
            .setOrigin(0, 0)
            .setMaxWidth(625);
        this.contEventLog.add(this.eventLogText);
        this.contEventLog.setDepth(PHASER_DEPTH.GAME_UI);
        this.contEventLog.setVisible(!this.contEventLog.visible);

        this.dwellerPanel = new DwellerPanel(this.gameScene, this);

        this.confirmModal = new LMModalConfirm(this.gameScene, this);
        this.confirmModal.container.setDepth(PHASER_DEPTH.ABOVE_ALL);

        this.mapInfo = new MapInfo(this.gameScene, this);
        this.mapInfo.container.setDepth(PHASER_DEPTH.GAME_UI_OVERLAY + 1);

        this.itemUseTargetUI = new ItemUseTargetUI(this.gameScene, this);
        this.itemUseTargetUI.container.setDepth(PHASER_DEPTH.GAME_UI_OVERLAY + 1);

        this.keyboardAttackUI = new KeyboardAttackUI(this.gameScene, this);
        this.keyboardAttackUI.container.setDepth(PHASER_DEPTH.GAME_UI_OVERLAY + 1);

        InputManager.instance.setActiveController(this);
    }

    ShowDeathScreen(msg: string) {


        this.contDeath = this.scene.add.container(0, 0);
        this.contDeath.add(
            this.scene.add.rectangle(0, 0, 640, 400, 0x000000, 1).setOrigin(0, 0).setStrokeStyle(1, 0xffffffff, 1),
        );
        let death_title = this.scene.add
            .dynamicBitmapText(0, 0, FONT.TITLE_32, "0", 64)
            .setOrigin(0.5, 0)
            .setTint(0xcc0000)
            .setCenterAlign();
        death_title.text = "YOU DIED.";
        let death_msg = this.scene.add.dynamicBitmapText(0, 0, FONT.BODY_24, "0", 24).setOrigin(0.5, 0);
        death_msg.text = msg;

        let btnExit = new LMButtonText(
            this.gameScene,
            "End",
            new Phaser.Math.Vector2(160, 40),
            new Phaser.Math.Vector2(0, 0),
            this.confirmDeath2.bind(this),
        );

        this.alignGrid.placeAtIndex(75, this.contDeath);

        this.contDeath.add(death_title);
        this.contDeath.add(death_msg);
        this.contDeath.add(btnExit.container);

        this.alignGrid.placeAtIndex(146, death_title, 0, 0, this.contDeath);
        this.alignGrid.placeAtIndex(241, death_msg, 0, 0, this.contDeath);
        this.alignGrid.placeAtIndex(302, btnExit.container, 0, 0, this.contDeath);

        this.contDeath.setDepth(PHASER_DEPTH.ABOVE_ALL);
    }


    async confirmDeath2() {

        let gameStore = this.gameScene.store.gameStore;


        try {
            InputManager.instance.clearActiveController();
            this.gameScene.scale.removeAllListeners();
            this.gameScene.input.removeAllListeners();
            this.gameScene.scene.stop();
            this.gameScene.scene.remove();

            await this.gameScene.game.destroy(true);

        } catch (e) {
            console.log("Game clean up error: " + e);
        }
        TimeUtil.sleep(100);

        gameStore.completeRun();
    }

    keyPressed(keyCode: number): void {
        if (!InputManager.instance.allowInput()) return;
        if (InputManager.instance.keyWait.includes(keyCode)) {
            CommandManager.instance.SendWait();
        } else if (InputManager.instance.keyLog.includes(keyCode)) {
            this.OpenLog();
        } else if (InputManager.instance.keyInventory.includes(keyCode)) {
            this.OpenCharSheet();
        } else if (InputManager.instance.keyCharsheet.includes(keyCode)) {
            this.OpenCharSheetStats();
        } else if (InputManager.instance.keyMap.includes(keyCode)) {
            this.mapInfo.Show();
        } else if (InputManager.instance.keyattack.includes(keyCode)) {
            this.OpenKeyboardTargetUI();
        } else if (InputManager.instance.keySwap.includes(keyCode)) {
            this.SwapWeapon();
        }
    }

    touch(point: Geom.Point): void {
        if (!InputManager.instance.allowInput()) return;
        if (!gameConfig.mapNavigation) return;
        let playerTile: GameMapTile = this.gameScene.player.tile;
        let t: GameMapTile = this.gameScene.map.GetTileAtPoint(point.x, point.y);

        if (t != undefined && t.isVisible && t.isRevealed) {
            if (t.hasDweller) {
                let range: number = this.gameScene.player.GetActiveWeaponRange();
                if (
                    this.gameScene.map.isInAttackRangeFrom(
                        this.gameScene.player.tile.x,
                        this.gameScene.player.tile.y,
                        t.x,
                        t.y,
                        range,
                    )
                ) {
                    CommandManager.instance.SendAttack(t);
                }
            } else if (this.gameScene.map.GetTileDistance(t.x, t.y, playerTile.x, playerTile.y) == 1) {
                if (t.hasStoryEvent || t.hasMerchant) {
                    CommandManager.instance.SendInteract(t);
                } else {
                    let dir: GlobalConst.MOVE_DIR = this.gameScene.map.GetTileDirection(
                        t.x,
                        t.y,
                        playerTile.x,
                        playerTile.y,
                    );
                    InputManager.instance.MoveButtonPressedButton(dir);
                }
            }
        }
    }

    moveKeyPressed(dir: GlobalConst.MOVE_DIR) {
        if (!InputManager.instance.allowInput()) return;
        this.sendMove(dir);
    }

    escapePressed(): void {
        this.contEventLog.setVisible(false);
    }

    optionPressed(opt: number): void {
    }

    confirmPressed(): void {
    }

    swipe(dir: GlobalConst.MOVE_DIR, swipeStart: Geom.Point, swipeEnd: Geom.Point) {
        if (!InputManager.instance.allowInput()) return;
        this.sendMove(dir);
    }

    sendMove(dir: GlobalConst.MOVE_DIR) {
        if (!InputManager.instance.allowInput()) return;
        CommandManager.instance.SendMove(dir);
    }

    GoToResultsScreen(): void {
        console.log("GO TO RESULTS SCREEN");
    }

    SwapWeapon(): void {
        console.log("Swap Weapon key pressed");
        CommandManager.instance.SendSwapWeapon();
    }

    OpenLog(): void {
        this.contEventLog.setVisible(!this.contEventLog.visible);
    }

    CommandWait() {
        if (!InputManager.instance.allowInput()) return;
        if (InputManager.instance.activeController != this) return;
        CommandManager.instance.SendWait();
    }

    OpenSettings(): void {
    }

    OpenItemTargetUI(item: InventoryItem): void {
        ToolTipManager.instance.Clear();
        this.itemUseTargetUI.SetItem(item);
        InputManager.instance.setActiveController(this.itemUseTargetUI);
        this.itemUseTargetUI.show();
    }

    OpenKeyboardTargetUI(): void {
        ToolTipManager.instance.Clear();
        InputManager.instance.setActiveController(this.keyboardAttackUI);
        this.keyboardAttackUI.show();
    }

    OpenCharSheet(openSlot: GlobalConst.EQUIPMENT_SLOT = null): void {
        if (!InputManager.instance.allowInput()) return;
        if (
            InputManager.instance.activeController != this &&
            InputManager.instance.activeController != this.charSheetStats
        )
            return;
        ToolTipManager.instance.Clear();
        InputManager.instance.setActiveController(this.charSheetInv);
        this.charSheetInv.show(openSlot);
        this.charSheetStats.hide();
    }

    OpenCharSheetStats(): void {
        if (!InputManager.instance.allowInput()) return;
        if (
            InputManager.instance.activeController != this &&
            InputManager.instance.activeController != this.charSheetInv
        )
            return;
        ToolTipManager.instance.Clear();
        InputManager.instance.setActiveController(this.charSheetStats);
        this.charSheetStats.show();
        this.charSheetInv.hide();
    }

    CloseCharSheet(): void {
        ToolTipManager.instance.Clear();
        InputManager.instance.setActiveController(this);
        this.charSheetStats.hide();
        this.charSheetInv.hide();
    }

    ForceCloseCharSheetIfOpen(): void {
        if (this.charSheetStats.IsOpen() || this.charSheetInv.IsOpen()) {
            this.CloseCharSheet();
        }
    }

    OpenGeneralModal(title: string, body: string, imagename: string): void {
        ToolTipManager.instance.Clear();
        InputManager.instance.setActiveController(this.generalModal);
        this.generalModal.show(title, body, imagename);
    }

    CloseGeneralModal(): void {
        ToolTipManager.instance.Clear();
        InputManager.instance.setActiveController(this);
        this.generalModal.hide();
    }

    OpenStoryEvent(storyEventInfo: M_StoryEventReveal): void {
        ToolTipManager.instance.Clear();
        InputManager.instance.setActiveController(this.storyEventModal);
        this.storyEventModal.show(storyEventInfo);
    }

    CloseStoryEvent(): void {
        ToolTipManager.instance.Clear();
        InputManager.instance.setActiveController(this);
        this.storyEventModal.hide();
    }

    OpenMerchant(info: M_MerchantReveal): void {
        InputManager.instance.setActiveController(this.merchantModal);
        this.merchantModal.show(info);
    }

    CloseMerchant(): void {
        ToolTipManager.instance.Clear();
        InputManager.instance.setActiveController(this);
        this.merchantModal.hide();
    }

    pointerMove(x: number, y: number) {
        let t: GameMapTile = this.gameScene.map.GetTileAtPoint(x, y);
        if (t != undefined && t.hasDweller) {
            if (this.activeDwellerHover != null && t.GetDweller() != this.activeDwellerHover) {
                ToolTipManager.instance.Clear();
                this.dwellerPanel.highlightClear(this.activeDwellerHover.id);
                this.activeDwellerHover = null;
            }

            if (this.activeDwellerHover == null) {
                this.activeDwellerHover = t.GetDweller();
                this.dwellerPanel.highlightHover(this.activeDwellerHover.id);
                let dweller: Dweller = t.GetDweller();
                this.activeDwellerHover = dweller;
            }
        } else {
            // ToolTipManager.instance.Clear();
            if (this.activeDwellerHover != null) {
                this.dwellerPanel.highlightClear(this.activeDwellerHover.id);
                this.activeDwellerHover = null;
            }
        }
    }

    public UpdateCharacterData() {
        if (!this.gameScene.player.receivedFirstUpdate) {
            return;
        }
        this.charSheetStats.updateData();
        //this.charSheetInv.updateData();
    }
}
