import GlobalConst from "../../../types/globalConst";
import { M_Condition, SourceD } from "../../../types/globalTypes";

export default class Condition implements M_Condition {
    kind: string;
    type: GlobalConst.CONDITION;
    cname: string;
    turns?: number;
    desc: string;
    sources: SourceD[];
    id: number;

    constructor() {
        this.cname = "Condition";
    }
}
