import settings from "../../settings";
import {GameMessage, StateMessage} from "../types/globalTypes";
import {sessionManager} from "./session";

class Websockets {
    private static _instance: Websockets;
    public ws: WebSocket | null;
    private responseCallback: () => void | undefined;
    public closeCallback: () => void | undefined;
    public errorCallback: () => void | undefined;

    private constructor() {
        this.ws = null;
    }

    private onConnect() {
        console.log("WS Connected");
    }

    //Use this for anything where you need a synchronous like response ie you NEED data that a resquest will create
    protected handleResponse() {
        websocketManager.responseCallback?.();
        websocketManager.responseCallback = undefined;
    }

    protected onMessage(this: WebSocket, ev: MessageEvent<any>) {
        sessionManager.processResponse(ev.data);
        websocketManager.handleResponse();
    }

    private onError() {
        //TODO: Should handle socket error with visible message
        console.log("WS ERROR");
        websocketManager.errorCallback?.();
        websocketManager.handleResponse();
    }

    private onClose() {
        //TODO: Should handle socket error with visible message
        console.log("WS CLOSED");
        websocketManager.closeCallback?.();
        websocketManager.closeCallback = undefined;
    }

    //Skipping pointless type checking
    public sendGeneric(command: any) {
        this.ws.send(JSON.stringify(command));
    }

    public async sendStateCommand(command: StateMessage, responseCallback?: () => void) {
        await this.ws.send(JSON.stringify(command));
        websocketManager.responseCallback = responseCallback;
    }

    public sendInput(input: GameMessage, responseCallback?: () => void) {
        console.log("ABOUT TO SEND::: " + JSON.stringify(input));
        if (this.ws != null) this.ws.send(JSON.stringify(input));
        websocketManager.responseCallback = responseCallback;
    }

    public async connect(connectCallback: Function): Promise<void> {
        if (this.ws) {
            close();
        }
        //let clearSave: string = eraseSaveData ? "1" : "0";
        //this.ws = new WebSocket(`${settings.WS_URL}?tokenId=${tokenId}&clearSave=${clearSave}`);
        this.ws = await new WebSocket(`${settings.WS_URL}`);
        this.ws.onclose = this.onClose;
        this.ws.onerror = this.onError;
        this.ws.onopen = () => {
            this.onConnect();
            console.log("connected?" + connectCallback);
            connectCallback();
        };
        this.ws.onmessage = this.onMessage;
    }

    public close(): void {
        console.log("closing ws", this.ws);
        if (this.ws) {
            this.ws.onerror = this.ws.onopen = null;
            this.ws.close();
            this.ws = null;
        }
    }


    public static get Instance() {
        return this._instance || (this._instance = new this());
    }
}

export const websocketManager = Websockets.Instance;
