import type Game from "../game";
import Dweller from "./dweller";
import DwellerData from "./data/DwellerData";
import * as Dwellers from "./data/AllDwellers";
import GlobalConst from "../types/globalConst";
import RandomUtil from "../utils/randomUtil";
import { HobGob } from "./data/AllDwellers";

/**
 * This class is a wrapper for the CreateDweller method
 * which takes a dweller "kind", loads the appropriate data
 * file from the dweller/data folder, and returns a Dweller
 * object.
 */
export default class DwellerFactory {
    dwellerData: Map<string, DwellerData> = new Map();

    private static _instance: DwellerFactory;
    public static get instance() {
        return this._instance || (this._instance = new this());
    }

    constructor() {
        this.dwellerData[GlobalConst.DWELLER_KIND.ARKAN] = new Dwellers.Arkan();
        this.dwellerData[GlobalConst.DWELLER_KIND.BANANACH] = new Dwellers.Bananach();
        this.dwellerData[GlobalConst.DWELLER_KIND.BLACK_PUDDING] = new Dwellers.BlackPudding();
        this.dwellerData[GlobalConst.DWELLER_KIND.BROWN_PUDDING] = new Dwellers.BrownPudding();
        this.dwellerData[GlobalConst.DWELLER_KIND.BROWNIE] = new Dwellers.Brownie();
        this.dwellerData[GlobalConst.DWELLER_KIND.BUBBLE_EYES] = new Dwellers.BubbleEyes();
        this.dwellerData[GlobalConst.DWELLER_KIND.COCKATRICE] = new Dwellers.Cockatrice();
        this.dwellerData[GlobalConst.DWELLER_KIND.COLLECTOR] = new Dwellers.Collector();
        this.dwellerData[GlobalConst.DWELLER_KIND.CRAWLER] = new Dwellers.Crawler();
        this.dwellerData[GlobalConst.DWELLER_KIND.DEAD_KNIGHT] = new Dwellers.DeadKnight();
        this.dwellerData[GlobalConst.DWELLER_KIND.DEVIL_BONES] = new Dwellers.DevilBones();
        this.dwellerData[GlobalConst.DWELLER_KIND.DITCH_WITCH] = new Dwellers.DitchWitch();
        this.dwellerData[GlobalConst.DWELLER_KIND.DRAMOCK] = new Dwellers.Dramock();
        this.dwellerData[GlobalConst.DWELLER_KIND.DWARV] = new Dwellers.Dwarv();
        this.dwellerData[GlobalConst.DWELLER_KIND.FEY_WING] = new Dwellers.FeyWing();
        this.dwellerData[GlobalConst.DWELLER_KIND.FOMOIAN] = new Dwellers.Fomoian();
        this.dwellerData[GlobalConst.DWELLER_KIND.GAINS_GOBLIN] = new Dwellers.GainsGoblin();
        this.dwellerData[GlobalConst.DWELLER_KIND.GARGOYLE] = new Dwellers.Gargoyle();
        this.dwellerData[GlobalConst.DWELLER_KIND.GEM_LIZARD] = new Dwellers.GemLizard();
        this.dwellerData[GlobalConst.DWELLER_KIND.GHAST] = new Dwellers.Ghast();
        this.dwellerData[GlobalConst.DWELLER_KIND.GIANT_BATS] = new Dwellers.GiantBats();
        this.dwellerData[GlobalConst.DWELLER_KIND.GIANT_RAT] = new Dwellers.GiantRat();
        this.dwellerData[GlobalConst.DWELLER_KIND.GIANT_SPIDER] = new Dwellers.GiantSpider();
        this.dwellerData[GlobalConst.DWELLER_KIND.GIANT_SNAKE] = new Dwellers.GiantSnake();
        this.dwellerData[GlobalConst.DWELLER_KIND.GIANT_WASP] = new Dwellers.GiantWasp();
        this.dwellerData[GlobalConst.DWELLER_KIND.GOBLIN] = new Dwellers.Goblin();
        this.dwellerData[GlobalConst.DWELLER_KIND.GREIGER] = new Dwellers.Greiger();
        this.dwellerData[GlobalConst.DWELLER_KIND.HARPY] = new Dwellers.Harpy();
        this.dwellerData[GlobalConst.DWELLER_KIND.HOBGOB] = new Dwellers.HobGob();
        this.dwellerData[GlobalConst.DWELLER_KIND.JELCUBE] = new Dwellers.JelCube();
        this.dwellerData[GlobalConst.DWELLER_KIND.KOBOLD] = new Dwellers.Kobold();
        this.dwellerData[GlobalConst.DWELLER_KIND.MANTICORE] = new Dwellers.Manticore();
        this.dwellerData[GlobalConst.DWELLER_KIND.MIRTHCREANT] = new Dwellers.Mirthcreant();
        this.dwellerData[GlobalConst.DWELLER_KIND.NIGHT_FATHER] = new Dwellers.NightFather();
        this.dwellerData[GlobalConst.DWELLER_KIND.PARALISK] = new Dwellers.Paralisk();
        this.dwellerData[GlobalConst.DWELLER_KIND.QUEX] = new Dwellers.Quex();
        this.dwellerData[GlobalConst.DWELLER_KIND.SHADOW_ELF] = new Dwellers.ShadowElf();
        this.dwellerData[GlobalConst.DWELLER_KIND.SKELL] = new Dwellers.Skell();
        this.dwellerData[GlobalConst.DWELLER_KIND.SLIME] = new Dwellers.Slime();
        this.dwellerData[GlobalConst.DWELLER_KIND.STACHELIG] = new Dwellers.Stachelig();
        this.dwellerData[GlobalConst.DWELLER_KIND.TOOTH_TUBE] = new Dwellers.ToothTube();
        this.dwellerData[GlobalConst.DWELLER_KIND.TROLL] = new Dwellers.Troll();
        this.dwellerData[GlobalConst.DWELLER_KIND.TRAVELER] = new Dwellers.Traveler();
        this.dwellerData[GlobalConst.DWELLER_KIND.WERERAT] = new Dwellers.Wererat();
        this.dwellerData[GlobalConst.DWELLER_KIND.VODYANOI] = new Dwellers.Vodyanoi();
        this.dwellerData[GlobalConst.DWELLER_KIND.WISP] = new Dwellers.Wisp();
        this.dwellerData[GlobalConst.DWELLER_KIND.WYRDEN_CAT] = new Dwellers.WyrdenCat();
        this.dwellerData[GlobalConst.DWELLER_KIND.ZOMBIE] = new Dwellers.Zombie();

        // ... and so on
    }

    //Note level should be one below CR (CR1 = level 0)
    CreateDweller(game: Game, kind: GlobalConst.DWELLER_KIND, level: number): Dweller {
        let dweller: Dweller = new Dweller(game, "", kind, level);
        return dweller;
    }

    CreateRandomDweller(game: Game, level: number): Dweller {
        let kind = RandomUtil.instance.fromEnum(GlobalConst.DWELLER_KIND);
        // console.log("generating dweller of kind " + kind);
        return this.CreateDweller(game, kind, level);
    }

    GetDwellerData(kind: GlobalConst.DWELLER_KIND): DwellerData {
        if (this.dwellerData[kind] == null) {
            throw new Error("Unknown dweller kind " + kind);
        }
        return this.dwellerData[kind];
    }

    CheckIfDwellerKindExists(kind: GlobalConst.DWELLER_KIND): boolean {
        return this.dwellerData[kind] != null;
    }
}
