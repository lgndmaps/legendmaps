import express from "express";
import jwt from "express-jwt";

import { config } from "../../config";
import * as controller from "./controller";

export const gameRouter = express.Router();

/** Authenticated route */
gameRouter.route("/session/:userId").get(controller.getSession);
gameRouter.route("/session/create/:userId").post(controller.startSession);
gameRouter.route("/campaign/:userId").get(controller.getCampaign);
gameRouter.route("/create/:userId").post(controller.startCampaign);
gameRouter.route("/mapOptions").get(controller.getAvailableMaps);

gameRouter.route("/campaign/end").post(controller.endCampaign);
gameRouter.route("/session/end").post(controller.endRun);
gameRouter.route("/session/end/:userId").post(controller.endSession);
gameRouter.route("/campaign/levelup").post(controller.processLevelUp);

gameRouter.route("/get-rewards").post(controller.getPendingRewards);
gameRouter.route("/get-redeemed-rewards").post(controller.getRedeemedRewards);
gameRouter.route("/claim-single").post(controller.claimPendingReward);
gameRouter.route("/claim-all").post(controller.claimAllPendingRewards);
gameRouter.route("/reward-claimed").post(controller.clearPendingReward);

/** Authenticated route */
// gameRouter.route("/move/:userId").patch(jwt(config), controller.patch);
