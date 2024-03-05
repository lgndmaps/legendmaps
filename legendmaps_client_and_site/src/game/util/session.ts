import settings from "../../settings";

class Session {
    private static _instance: Session;
    public session: any;
    private sessionUpdateCallback: () => void;

    private constructor() {
        this.session = null;
    }

    public processResponse(response: string) {
        this.session = response;
        console.log("RESPONSE" + response);
        if (this.sessionUpdateCallback) {
            this.sessionUpdateCallback();
        }
    }

    public setSessionUpdateCallback(callback: () => void) {
        this.sessionUpdateCallback = callback;
    }

    public static get Instance() {
        return this._instance || (this._instance = new this());
    }
}

export const sessionManager = Session.Instance;
