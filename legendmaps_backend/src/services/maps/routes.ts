import express from "express";
import * as controller from "./controller";

export const mapRouter = express.Router();

/** GET /api/maps */
mapRouter.route("/").get(controller.find);

/** GET /api/maps/:tokenId */
mapRouter.route("/:tokenId").get(controller.getSingle);
