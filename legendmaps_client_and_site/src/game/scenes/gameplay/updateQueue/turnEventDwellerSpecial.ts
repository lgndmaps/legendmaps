import TurnEvent from "./turnEvent";
import {M_TurnEvent_DwellerSpecial} from "../../../types/globalTypes";
import GlobalConst from "../../../types/globalConst";
import TimeUtil from "../../../util/timeUtil";
import Dweller from "../entities/Dweller";
import EntityManager from "../entities/EntityManager";
import {GameMapTile} from "../map/GameMapTile";
import EffectHitGeneric from "../effects/EffectHitGeneric";

export default class TurnEventDwellerSpecial extends TurnEvent {
    p: M_TurnEvent_DwellerSpecial;
    targetTile: GameMapTile;
    dweller: Dweller;

    protected override parseEvent(): boolean {
        this.p = this.mTurnEventParam as M_TurnEvent_DwellerSpecial;
        this.dweller = EntityManager.instance.GetOrCreateDweller(this.p.id, this.p.kind, this.p.name);
        return true;
    }

    override async process() {
        await this.gameScene.turnText.showWithFlags(this.p.setupDesc, [GlobalConst.MESSAGE_FLAGS.ELLIPSES]);
        await TimeUtil.sleep(500);

        this.gameScene.uiCombat.AnimateMapAttack(
            this.dweller,
            this.gameScene.player.tile,
            "special",
            GlobalConst.DAMAGE_TYPES.COLD,
        );
        await TimeUtil.sleep(250);
        let hitEff = new EffectHitGeneric();
        hitEff.damageType = GlobalConst.DAMAGE_TYPES.ARCANE;
        hitEff.Init(this.gameScene, this.gameScene.player.tile, 0);
        hitEff.Play();
        await this.gameScene.turnText.showWithFlags(this.p.resultDesc, [
            GlobalConst.MESSAGE_FLAGS.APPEND,
            GlobalConst.MESSAGE_FLAGS.EMPHASIZE,
            GlobalConst.MESSAGE_FLAGS.DELAY_AFTER,
        ]);
        await TimeUtil.sleep(500);
    }
}
