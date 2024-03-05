import { computed, action, observable, makeObservable, runInAction } from "mobx";
import settings from "../settings";
import { ISession } from "../types/userTypes";
import { getSession, logout, startAuth } from "../util/auth";
import Cookies from "js-cookie";

import { RootStore } from "./RootStore";
import { USER_COOKIES } from "../constants/userValues";
import { checkAllowlist, claimAllowlist } from "../util/api/endpoints";
import { redeemRewards, redeemSingleReward } from "../util/api/GameApi";
import { BigNumber } from "ethers";
import { powerups } from "../assets/data/powerups";

export type CurrencyBalances = {
    gold?: number;
};

export type CurrencyBalanceTypes = "gold";

export class AccountStore {
    private rootStore: RootStore;

    featureFlags: {
        devMode: boolean;
        earlyAccess: boolean;
    };

    @observable initialLoadAttempted: boolean = false;
    @observable loadingAccount: boolean = false;
    @observable loggingIn: boolean = false;
    @observable loginError: string | null = null;
    @observable token: string | undefined;
    @observable isLoggedIn: boolean = false;
    @observable user: ISession | null;
    @observable hasAllowlistReservation: boolean = false;
    @observable loadingAllowlistStatus: boolean = false;
    @observable allowlistClaimError: boolean = false;
    @observable allowlistClaimMessage: string = "";
    @observable activeDwellerFilter: "full" | "phylum";
    @observable fetchingRewards: boolean = false;
    @observable currencyBalances: CurrencyBalances = {};
    @observable powerupsBalances: Map<number, number> = new Map<number, number>();

    constructor(_rootStore: RootStore) {
        makeObservable(this);
        this.rootStore = _rootStore;
        this.activeDwellerFilter = "full";
        this.featureFlags = {
            devMode: false,
            earlyAccess: false,
        };
    }

    @action async loadUser() {
        this.loadingAccount = true;
        this.user = await getSession();
        if (this.user) {
            this.rootStore.adventurersStore.loadUserAdventurers();
            this.rootStore.mapsStore.loadUserMaps();
            this.isLoggedIn = true;
            if (this.user.role === "admin") {
                this.featureFlags.devMode = true;
                this.featureFlags.earlyAccess = true;
            }
        }
        this.initialLoadAttempted = true;
        this.loadingAccount = false;
        return this.user;
    }

    @action async login(publicAddress: string, provider, ens: string) {
        this.loggingIn = true;
        await startAuth(publicAddress, provider, ens !== "" ? ens : publicAddress);
        const userData = await getSession("");
        if (userData) {
            this.user = userData;
            this.isLoggedIn = true;
            this.rootStore.adventurersStore.loadUserAdventurers();
            this.rootStore.mapsStore.loadUserMaps();
        } else {
            this.loginError = "Something went wrong. Please try again";
            setTimeout(() => {
                this.loginError = null;
            }, 1500);
        }
        this.loggingIn = false;
    }

    @action async logout() {
        Cookies.remove(USER_COOKIES.LM_JWT);
        this.user = null;
        await logout();
    }

    @action async claimAllowlist(project: string) {
        const response = await claimAllowlist(project);
        if (response.error) {
            this.allowlistClaimError = true;
            this.allowlistClaimMessage = response.error;
        } else {
            this.allowlistClaimError = false;
            this.allowlistClaimMessage = "Success";
        }
    }

    @action async fetchAllowlistStatus() {
        this.loadingAllowlistStatus = true;
        const allowListStatus = await checkAllowlist();
        this.hasAllowlistReservation = allowListStatus !== null;
        this.loadingAllowlistStatus = false;
    }

    @action async redeemSingleReward(id: number) {
        this.fetchingRewards = true;
        const rewards = await redeemSingleReward(id);
        this.fetchingRewards = false;

        return rewards;
    }

    @action async redeemAllReward() {
        this.fetchingRewards = true;
        const rewards = await redeemRewards();
        this.fetchingRewards = false;

        return rewards;
    }

    @action setCurrencyBalance(balanceType: CurrencyBalanceTypes, amount: number) {
        this.currencyBalances[balanceType] = amount;
    }

    @computed get hasPowerups() {
        return Array.from(this.powerupsBalances.values()).some((v) => v > 0);
    }

    @action setPowerupsBalance(powerupsCounts: BigNumber[]) {
        powerupsCounts.map((p, index) => {
            this.powerupsBalances.set(powerups[index]?.id, p.toNumber());
        });
    }
}
