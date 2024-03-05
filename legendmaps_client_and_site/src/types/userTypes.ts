import {Dispatch, SetStateAction} from "react";
import {IMapD} from "./mapTypes";

export type IDiscordSession = {
    data: IDiscordUser;
    avatar: string;
    discriminator: string;
    id: string;
    username: string;
    isLoading: boolean;
};

export type IDiscordUser = {
    avatar: string;
    discriminator: string;
    id: string;
    username: string;
};

export interface ISessionContext {
    myMaps: Array<number>;
    viewingMap: number | null;
    viewingMyMaps: boolean;
    loadedMaps: Array<IMapD>;
    viewingAdventurer: number | null;
    setMyMaps: Dispatch<SetStateAction<Array<number>>>;
    setViewingMap: Dispatch<SetStateAction<number | null>>;
    setViewingMyMaps: Dispatch<SetStateAction<boolean>>;
    setLoadedMaps: Dispatch<SetStateAction<Array<IMapD>>>;
    setViewingAdventurer: Dispatch<SetStateAction<number | null>>;
}

export interface IWebsocketContext {
    ws: WebSocket;
    sendInput: (input: string) => void;
    connect: () => void;
    close: () => void;
}

export interface IAuthContext {
    user?: ISession | null;
    isAuthenticated: boolean;
    logout: () => void;
    login: (publicAddress: string, provider: any, ens: string) => void;
    loggingIn: boolean;
    loginError: string | null;
    isLoading: boolean;
}

export type ISession = {
    id: number;
    nonce: number;
    publicAddress: string;
    username?: string;
    ens?: string;
    discordId?: string;
    role?: "admin" | "adv-owner" | "early-access" | "user" | "scribe" | "lore-keeper" | "blessed";
};

export interface JwtDecoded {
    payload: {
        id: string;
        publicAddress: string;
    };
}

export type PendingReward = {
    id: number;
    userId?: number;
    spendId?: number;
    spendAmount?: number;
    issueId?: number;
    issueAmount?: number;
    source?: "Dungeon Victory" | "Adventurer Defeated" | "Adventurer Escaped";
    sourceDetails?: string;
    userAddress?: string;
    claimed?: boolean;
};

export type RewardRequests = {
    userId: number;
    userAddress: string;
    consumedRewards: PendingReward[];
    signature: string;
    nonce: string;
};
