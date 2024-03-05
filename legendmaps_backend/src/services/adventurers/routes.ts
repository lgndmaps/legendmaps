import express from "express";
import * as controller from "./controller";

export const adventurerRouter = express.Router();

/** GET /api/maps */
adventurerRouter.route("/").get(controller.find);

/** GET /api/maps/:tokenId */
adventurerRouter.route("/:tokenId").get(controller.getSingle);

adventurerRouter.route("/:tokenId/description").post(controller.updateDescription);
