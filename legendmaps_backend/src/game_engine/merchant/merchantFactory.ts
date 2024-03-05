import Game from "../game";
import GlobalConst from "../types/globalConst";
import ObjectUtil from "../utils/objectUtil";
import { ProbTable } from "../utils/probTable";
import MerchantData from "./data/merchantData";
import Merchant from "./merchant";
import MerchantMagic from "./data/merchantMagic";
import MerchantFood from "./data/merchantFood";
import MerchantArmor from "./data/merchantArmor";
import MerchantWeapon from "./data/merchantWeapon";
import MerchantClothing from "./data/merchantClothing";
import MerchantPotion from "./data/merchantPotion";

export default class MerchantFactory {
    merchantData: Map<string, MerchantData> = new Map();
    private merchantProbTable: ProbTable<GlobalConst.MERCHANT_TYPES>;

    private static _instance: MerchantFactory;
    public static get instance() {
        return this._instance || (this._instance = new this());
    }

    constructor() {
        this.merchantData[GlobalConst.MERCHANT_TYPES.MAGIC] = new MerchantMagic();
        this.merchantData[GlobalConst.MERCHANT_TYPES.FOOD] = new MerchantFood();
        this.merchantData[GlobalConst.MERCHANT_TYPES.ARMOR] = new MerchantArmor();
        this.merchantData[GlobalConst.MERCHANT_TYPES.WEAPON] = new MerchantWeapon();
        this.merchantData[GlobalConst.MERCHANT_TYPES.CLOTHING] = new MerchantClothing();
        this.merchantData[GlobalConst.MERCHANT_TYPES.POTION] = new MerchantPotion();

        this.merchantProbTable = new ProbTable<GlobalConst.MERCHANT_TYPES>();
        for (const d of ObjectUtil.EnumKeys(GlobalConst.MERCHANT_TYPES)) {
            let merchant_data = this.merchantData[GlobalConst.MERCHANT_TYPES[d]];
            // console.log(d + " " + GlobalConst.MERCHANT_TYPES[d] + " " + merchant_data);
            if (merchant_data != undefined && merchant_data.allowRandomSpawns) {
                this.merchantProbTable.add(merchant_data.kind, merchant_data.randomSpawnWeight);
            }
        }
    }

    CreateMerchant(game: Game, kind: GlobalConst.MERCHANT_TYPES): Merchant {
        return new Merchant(game, "", kind);
    }

    CreateRandomMerchant(game: Game): Merchant {
        let roll = this.merchantProbTable.roll();
        return this.CreateMerchant(game, roll);
    }

    GetMerchantData(kind: GlobalConst.MERCHANT_TYPES): MerchantData {
        if (this.merchantData[kind] == null) {
            throw new Error("Unknown merchant type: " + kind);
        }
        return this.merchantData[kind];
    }
}
