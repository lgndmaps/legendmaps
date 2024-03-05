import express from "express";
import jwt from "express-jwt";

import { config } from "../../config";
import * as controller from "./controller";

export const userRouter = express.Router();

/** GET /api/users */
userRouter.route("/").get(controller.find);

/** GET /api/users/:userId */
/** Authenticated route */
userRouter.route("/me").get(controller.get);

/** POST /api/users */
userRouter.route("/").post(controller.create);

/** PATCH /api/users/:userId */
/** Authenticated route */
userRouter.route("/:userId").patch(controller.patch);
userRouter.route("/refresh-owned").post(controller.updateOwned);

userRouter.route("/:userId/discord").patch(controller.discord);
