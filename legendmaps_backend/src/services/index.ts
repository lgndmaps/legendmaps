import express from "express";

import { authRouter } from "./auth";
import { userRouter } from "./users";
import { gameRouter } from "./game";
import { mapRouter } from "./maps";
import { adventurerRouter } from "./adventurers";
import { allowlistRouter } from "./allowlist";
export const services = express.Router();

services.use("/auth", authRouter);
services.use("/users", userRouter);
services.use("/game", gameRouter);
services.use("/maps", mapRouter);
services.use("/adventurers", adventurerRouter);

services.use("/allowlist", allowlistRouter);
