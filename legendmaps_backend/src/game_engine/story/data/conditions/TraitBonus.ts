import Game from "../../../game";
import GameUtil from "../../../utils/gameUtil";
import TraitManager from "../../../character/traitManager";

export default class TraitBonus {
    traitId: number;
    bonus: number;

    constructor(skillId: number, bonus: number) {
        this.traitId = skillId;
        this.bonus = bonus;
    }

    GetTraitName(game: Game): string {
        return TraitManager.instance.GetTraitInfoById(this.traitId).name;
    }
}
