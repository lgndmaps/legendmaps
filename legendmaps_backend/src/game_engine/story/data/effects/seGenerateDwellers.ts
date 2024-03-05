import StoryEventEffect from "../storyEventEffect";
import Game from "../../../game";
import { M_StoryEventOutcome, M_TurnEvent_Names } from "../../../types/globalTypes";
import GlobalConst from "../../../types/globalConst";
import Dweller from "../../../dweller/dweller";
import Spells from "../../../effect/spells";
import DwellerFactory from "../../../dweller/dwellerFactory";
import StoryEvent from "../../storyEvent";

export default class StoryEffectGenerateDwellers extends StoryEventEffect {
    dweller_type: GlobalConst.DWELLER_KIND;
    count: number;

    constructor(
        dweller_type?: GlobalConst.DWELLER_KIND,
        dweller_phylum?: GlobalConst.DWELLER_PHYLUM, //ignored
        count: number = 1,
    ) {
        super();
        if (dweller_type) this.dweller_type = dweller_type;
        this.count = count;
    }

    override Apply(game: Game, storyEvent: StoryEvent) {
        let kind: GlobalConst.DWELLER_KIND | undefined = undefined;
        if (this.dweller_type) {
            kind = this.dweller_type;
        } else {
            // totally random
        }

        for (let i = 0; i < this.count; i++) {
            Spells.SummonDweller(game, game.dungeon.character, kind);
        }
        let eventDetails: M_StoryEventOutcome = {
            text: "You sense a malevolent presence.",
        };
    }
}
