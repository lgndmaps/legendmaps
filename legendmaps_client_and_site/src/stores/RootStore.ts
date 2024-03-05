import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree";
import { Counter } from "./Counter";
import { AdventurersContractStore } from "./AdventurersContractStore";
import { MapsStore } from "./MapsStore";

import { action, computed, makeObservable, observable } from "mobx";
import { AccountStore } from "./AccountStore";
import { AdventurersStore } from "./AdventurersStore";
import { GameStore } from "./GameStore";
import { ErrorStore } from "./ErrorStore";
export interface IRootStore {
    contractStore: AdventurersContractStore;
}

export class RootStore {
    adventurersContractStore: AdventurersContractStore;
    adventurersStore: AdventurersStore;
    mapsStore: MapsStore;
    accountStore: AccountStore;
    gameStore: GameStore;
    errorStore: ErrorStore;

    @observable initialized = false;
    @computed get hasInitialized() {
        return this.initialized;
    }

    constructor() {
        makeObservable(this);
        this.accountStore = new AccountStore(this);
        this.adventurersContractStore = new AdventurersContractStore(this);
        this.mapsStore = new MapsStore(this);
        this.adventurersStore = new AdventurersStore(this);
        this.gameStore = new GameStore(this);
        this.errorStore = new ErrorStore(this);
        this.adventurersContractStore.initializeContract();
        this.mapsStore.initializeContract();
        if (typeof window !== "undefined") {
            this.accountStore.loadUser();
        }
    }

    @action loadInit = async () => {};
}

export const rootStore = new RootStore();

export const gameStore = rootStore.gameStore;
