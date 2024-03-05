import Game from "../../../game";
import GameUtil from "../../../utils/gameUtil";

export default class SkillBonus {
    skillId: number;
    bonus: number;

    constructor(skillId: number, bonus: number) {
        this.skillId = skillId;
        this.bonus = bonus;
    }

    GetSkillName(game: Game): string {
        const skill = GameUtil.GetSkillById(this.skillId);
        return skill.name;
    }
}
