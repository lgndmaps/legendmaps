import GlobalConst from "../../../types/globalConst";
import { M_Effect } from "../../../types/globalTypes";
import { GameScene } from "../GameScene";

export class Effect implements M_Effect {
    id: number;
    cname: string;
    kind: string;
    name: string;
    type: GlobalConst.EFFECT_TYPES;
    trigger: GlobalConst.EFFECT_TRIGGERS;
    amount_base: number;
    amount_max?: number;
    chance?: number;
    turns?: number;
    damage_type?: GlobalConst.DAMAGE_TYPES;
    cooldown?: number;
    turn_applied?: number;
    range?: number = 1;
    aoe?: number;
    source_item_id: number;
    flags: number = 0; //GlobalConst.EFFECT_FLAGSll

    constructor() {}
}
