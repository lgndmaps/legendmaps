import { DEBUG_MODE, LOGGING_ENABLED } from "../config";
const logMsg = (source: any, msg: string) => {
    if (DEBUG_MODE || LOGGING_ENABLED) {
        console.log("GAME LOG:", source, msg);
    }
};

export const GameLogger = {
    logMsg,
};
