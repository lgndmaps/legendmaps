import express from "express";
import jwt from "express-jwt";

import { config } from "../../config";
import * as controller from "./controller";

export const allowlistRouter = express.Router();

/** GET /api/users */
allowlistRouter.route("/").get(controller.find);

/** GET /api/users/:userId */
/** Authenticated route */
allowlistRouter.route("/me").get(controller.get);

/** POST /api/users */
allowlistRouter.route("/:projectId").post(controller.create);

allowlistRouter.route("/count/:projectId").get(controller.count);
