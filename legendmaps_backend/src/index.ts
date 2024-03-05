import * as Sentry from "@sentry/node";

const path = require("path");
const session = require("express-session");
import jwt from "jsonwebtoken";

const url = require("url");
var cron = require("node-cron");

require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
import "./db";
import cors from "cors";
import express from "express";

const cookieParser = require("cookie-parser");
import { services } from "./services";
import Session from "express-session";
import WebSocket from "ws";
import { RequestWithSession } from "./types/requests";
import { config } from "./config";
import { SessionUtil } from "./game_engine/utils/sessionUtil";
import MessageProcessor from "./game_engine/client_comm/MessageProcessor";
import { CommandProcessor } from "./game_engine/client_comm/commandProcessor";

const SequelizeStore = require("connect-session-sequelize")(session.Store);
import { sequelize } from "./db";
import { querySchema } from "./schemas/querySchema";
import { validateMiddleware } from "./middlewares/validationMiddleware";
import Game from "./game_engine/game";
import fetch from "node-fetch";
import { Adventurer } from "./models";
import { DBInterface } from "./game_engine/utils/dbInterface";
import { fetchCsv } from "./utils/csvloader";
import { ADVENTURER_PROJECTS } from "./constants/adventurers";
import { generateTokenContractSignature } from "./utils/contractUtils";
import { BigNumber } from "ethers";

const MemoryStore = require("memorystore")(session);

Sentry.init({
    dsn: "SENTRY_URL_HERE",
});

export const allowedOrigins = [
    // Client development origin.
    "http://localhost:3000",
    "http://localhost:3000/"
];

const app = express();

const sequelizeStore = new SequelizeStore({
    db: sequelize,
    expiration: 1000 * 60 * 60 * 24 * 30,
    checkExpirationInterval: 15 * 60 * 1000,
});

app.set("trust proxy", 1);

const sessionParser = Session({
    name: "lm-session",
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET || "$eCr3T",
    resave: false,

    store: sequelizeStore,
    // store: new MemoryStore({
    //   checkPeriod: 86400000, // prune expired entries every 24h
    //   ttl: 1000 * 60 * 60 * 24 * 30,
    // }),
    cookie: {
        httpOnly: true,
        secure: process.env.IS_SECURE === "true" ? true : false,
        sameSite: process.env.IS_SECURE === "true" ? "none" : "lax",
        maxAge: 30 * 24 * 60 * 60 * 1000,
    },
});

sequelizeStore.sync();

export const getCORSOrigin = (origin: any, callback: any) => {
    // origin === undefined when there are no "cross"-origin requests.
    if (app.get("env") !== "production") {
        callback(null, true);
    }
    if (origin === undefined || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
    } else {
        callback(new Error(`Origin "${origin}" is not allowed by CORS`));
    }
};

// Middlewares
app.use(express.json());
// app.use(cookieParser());
app.use(sessionParser);
//@ts-ignore
app.use(
    cors({
        credentials: true,
        origin: [
            "http://localhost:3000",
        ],
        methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD", "PATCH"],
    }),
);
app.use(validateMiddleware(querySchema, "query"));

// Mount REST on /api
app.use("/api", services);

const port = process.env.PORT || 8000;

const server = app.listen(port, () => console.log(`Express app listening on localhost:${port}`));

export const socketMap = new Map();

export const wss = new WebSocket.Server({ noServer: true });

function heartbeat(ws: WebSocket) {
    //console.log("heartbeat check");
    //heartbeat check
    //@ts-ignore
    ws.isAlive = true;
}

wss.on("connection", async function (ws, request: RequestWithSession) {
    console.log("connection request received");
    let game: Game = null;
    // if (!request.session.jwt) {
    //   ws.send(`Missing authentication parameters for socket request`);
    //   ws.terminate();
    //   return;
    // }
    // jwt.verify(request.session.jwt, config.secret, (err, decoded) => {
    //   if (err) {
    //     ws.send(`Invalid JWT`);
    //     ws.terminate();
    //     return;
    //   }
    // });

    //SETTING USER ID
    if (!request.session.userId) {
        if (process.env.DEBUGGING_GAME) {
            request.session.userId = 1;
        } else {
            ws.send(`Missing user ID`);
            ws.terminate();
            return;
        }
    }
    const userId = request.session.userId;
    socketMap.set(userId, ws);

    //@ts-ignore
    ws.isAlive = true;

    ws.on("pong", () => heartbeat(ws));

    ws.on("message", async function (message) {
        //console.log("MESSAGE RCVD " + message);
        //TODO: Check for version mismatch from client gameConfig and server gameConfig
        try {
            const commandResponse = await MessageProcessor.processMessage(
                userId,
                request,
                message.toString(),
                game,
                (g: Game) => {
                    game = g;
                    return game;
                },
            );
            //console.log("RESPONSE: ", commandResponse);
            ws.send(JSON.stringify(commandResponse));
        } catch (e) {
            console.error(e);
            Sentry.captureException(new Error(e));
            ws.send(JSON.stringify({ message: "Error", error: e }));
        }
    });

    ws.on("close", async function () {
        try {
            await SessionUtil.endSession(userId.toString(), game);
        } catch (e) { }
        socketMap.delete(userId);
    });

    ws.on("connect_error", (err) => {
        console.log(`connect_error due to ${err.message}`);
        Sentry.captureException(new Error(err));
    });
});

const interval = setInterval(function ping() {
    wss.clients?.forEach(function each(ws) {
        //@ts-ignore
        if (ws.isAlive === false) return ws.terminate();

        //@ts-ignore
        ws.isAlive = false;
        ws.ping();
    });
}, 30000);

wss.on("close", function close() {
    clearInterval(interval);
});

server.on("upgrade", function (request: RequestWithSession, socket, head) {
    console.log("upgrade request");
    //@ts-ignore
    sessionParser(request, {}, () => {
        if (!process.env.DEBUGGING_GAME) {
            if (!request.session.userId || !request.session.siwe) {
                socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
                socket.destroy();
                return;
            }
        }

        //@ts-ignore
        wss.handleUpgrade(request, socket, head, function (ws) {
            wss.emit("connection", ws, request);
        });
    });
});

cron.schedule("0 0 * * *", () => {
    console.log("Running daily ownership refresh");
    Sentry.captureEvent({ message: "Daily ownership run" });
    DBInterface.refreshOwnership();
});

const loadVisitors = async () => {
    // fetchCsv("./src/csvs/frwc.csv", async (row) => {
    //     const advData = {
    //         tokenId: parseInt(row[0]),
    //         nativeTokenId: parseInt(row[1]),
    //         name: row[2],
    //         first_name: row[3],
    //         last_name: row[4],
    //         bags_total: parseInt(row[5]),
    //         brawn: parseInt(row[6]),
    //         agility: parseInt(row[7]),
    //         guile: parseInt(row[8]),
    //         spirit: parseInt(row[9]),
    //         traits: row[10].split(","),
    //         project: ADVENTURER_PROJECTS.FORGOTTEN_RUNES_WIZARDCULT,
    //     };
    //     const adv = await Adventurer.findByPk(advData.tokenId);
    //     if (adv) {
    //         Object.assign(adv, advData);
    //         adv.save();
    //     } else {
    //         Adventurer.create(advData);
    //     }
    // });
    fetchCsv("./src/csvs/cc.csv", async (row) => {
        const advData = {
            tokenId: parseInt(row[0]),
            nativeTokenId: parseInt(row[1]),
            name: row[2],
            first_name: row[3],
            last_name: row[4],
            bags_total: parseInt(row[5]),
            brawn: parseInt(row[6]),
            agility: parseInt(row[7]),
            guile: parseInt(row[8]),
            spirit: parseInt(row[9]),
            traits: row[10].split(","),
            project: ADVENTURER_PROJECTS.CRYPTO_COVEN,
        };
        const adv = await Adventurer.findByPk(advData.tokenId);
        if (adv) {
            Object.assign(adv, advData);
            adv.save();
        } else {
            Adventurer.create(advData);
        }
    });
};

generateTokenContractSignature(BigNumber.from(10), "0x0c561036936b38d9fd3F0f9eBD88B17E734D1ed1", 5);

//DBInterface.refreshOwnership();

// loadVisitors();
