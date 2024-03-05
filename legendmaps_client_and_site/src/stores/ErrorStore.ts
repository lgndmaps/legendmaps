import { action, computed, makeObservable, observable } from "mobx";
import { RootStore } from "./RootStore";

export class ErrorStore {
    rootStore: RootStore;
    @observable initialized = false;
    @observable popupMessage = "";
    timeout: NodeJS.Timeout;
    @computed get hasInitialized() {
        return this.initialized;
    }

    constructor(rootStore: RootStore) {
        makeObservable(this);
        this.rootStore = rootStore;
    }

    @action setErrorPopup = async (message: string) => {
        clearTimeout(this.timeout);
        this.popupMessage = message;
        this.timeout = setTimeout(() => {
            this.popupMessage = "";
        }, 3000);
    };
}
