import express from "express";

import * as controller from "./controller";

export const authRouter = express.Router();

/** POST /api/auth */
authRouter.route("/").post(controller.create);

authRouter.route("/nonce").get(controller.getNonce);

authRouter.route("/logout").post(controller.logout);
