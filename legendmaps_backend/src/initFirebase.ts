import { initializeApp } from "firebase/app";
import * as admin from "firebase-admin";

const dbCollectionID = "game_sessions";

const app = admin.initializeApp({
    credential: admin.credential.cert(process.env.GOOGLE_APPLICATION_CREDENTIALS || ""),
    databaseURL: `https://${process.env.PUBLIC_FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com`,
    // databaseAuthVariableOverride: {
    //   uid: "lm-backend-service",
    // },
});

const db = admin.database();
const ref = db.ref(dbCollectionID);

export const firebaseSettings = { app, db, ref };
