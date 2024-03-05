// import { SessionData } from "express-session";
// import { IncomingMessage } from "http";
// import { Session } from "inspector";
// import WebSocket from "ws";

// export const socketMap = new Map();

// type GameSocketMessage = IncomingMessage & {
//   session: Session & Partial<SessionData> & GameSession;
// };

// type GameSession = {
//   inputQueue?: string[];
//   userId: string;
// };

// export const wss = new WebSocket.Server({
//   clientTracking: false,
//   noServer: true,
// });

// function heartbeat(ws: WebSocket) {
//   console.log("heartbeat check");
//   //heartbeat check
//   //@ts-ignore
//   ws.isAlive = true;
// }

// wss.on("connection", function (ws, request: GameSocketMessage) {
//   const userId = request.session.userId;

//   socketMap.set(userId, ws);

//   //@ts-ignore
//   ws.isAlive = true;

//   ws.on("pong", () => heartbeat(ws));

//   ws.on("message", function (message) {
//     //
//     // Here we can now use session parameters.
//     //
//     console.log(`Received message ${message} from user ${userId}`);
//   });

//   ws.on("close", function () {
//     socketMap.delete(userId);
//   });
// });

// const interval = setInterval(function ping() {
//   wss.clients?.forEach(function each(ws) {
//     //@ts-ignore
//     if (ws.isAlive === false) return ws.terminate();

//     //@ts-ignore
//     ws.isAlive = false;
//     ws.ping();
//   });
// }, 30000);

// wss.on("close", function close() {
//   clearInterval(interval);
// });
