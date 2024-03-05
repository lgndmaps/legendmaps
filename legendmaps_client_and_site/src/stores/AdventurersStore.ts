import { JsonRpcProvider, StaticJsonRpcProvider } from "@ethersproject/providers";
import { action, computed, makeObservable, observable } from "mobx";
import { computedFn } from "mobx-utils";
import settings from "../settings";
import { RootStore } from "./RootStore";
import { Contract } from "ethers";
import { MerkleTree } from "merkletreejs";
import Web3 from "web3";
import OPERATOR_ABI from "../assets/contractABIs/LegendCoin.json";
import { IAdventurerD, OrderByOptions, SearchableFields, SearchOptions } from "../types/adventurerTypes";
import { urlSearchBuilder } from "../util/urlBuilders";
import { ADVENTURER_SEARCH_FIELDS, ORDER_BY, searchByOptions } from "../constants/adventurerConstants";

export const ADVENTURERS_CONTRACT_ADDRESS: { [chainId: number]: string } = {
    1: `0xCA72feCc4BDb993650654A9881F2Be15a7875796`,
};

const defaultFilter: AdventurerSearchFilter = {
    search: "",
    searchCategory: searchByOptions[0].value,
    options: [],
    orderBy: ORDER_BY.TOKEN_ID,
    orderDirection: "asc",
    onlyDescriptions: false,
    bagsValues: {
        brawn: "",
        agility: "",
        guile: "",
        spirit: "",
        total: "",
    },
};

export type AdventurerSearchFilter = {
    search: string;
    searchCategory: SearchableFields;
    options: SearchOptions;
    orderBy: OrderByOptions;
    orderDirection: "asc" | "desc";
    onlyDescriptions: boolean;
    bagsValues: {
        brawn: string | null;
        agility: string | null;
        guile: string | null;
        spirit: string | null;
        total: string | null;
    };
};

export class AdventurersStore {
    private rootStore: RootStore;
    @observable contractLoaded: boolean;
    @observable loadingContract: boolean;
    @observable networkId: number;
    @observable contractAddress: string;
    @observable defaultProvider: StaticJsonRpcProvider;
    @observable tokenProvider: JsonRpcProvider;
    @observable contract: Contract;
    @observable tokenContract: any;
    @observable userAdventurers: IAdventurerD[] = [];
    @observable userAdventurerTokens: Set<number>;
    @observable adventurerCount: number | null;
    @observable loadedAdventurersOffset: number = 0;
    @observable loadingUserAdventurers: boolean = false;
    @observable filter: AdventurerSearchFilter;
    @observable userAdventurersLoaded: boolean = false;
    web3: Web3;
    merkleTree: MerkleTree;
    totalSupply: number;
    supplyRemaining: number;

    maxLoad = 12;

    constructor(_rootStore: RootStore) {
        makeObservable(this);
        this.rootStore = _rootStore;
        this.filter = defaultFilter;
        this.userAdventurerTokens = new Set<number>();
    }

    @computed get hasMore() {
        return this.adventurerCount !== this.adventurersList.length;
    }

    @action initializeContract = async () => {
        this.web3 = new Web3();
        //@ts-ignore
        this.tokenContract = new this.web3.eth.Contract(OPERATOR_ABI, settings.COIN_ADDRESS);
    };

    @action checkIsOwner = async (tokenId: number) => {
        const { accountStore, adventurersStore } = this.rootStore;
        const user = await accountStore.loadUser();
        await adventurersStore.loadUserAdventurers();
        //@ts-ignore
        if (this.userAdventurers.length) {
            let isOwner = false;

            this.userAdventurers.forEach((adv) => {
                if (adv.owner?.toLowerCase() === user.publicAddress?.toLowerCase() && tokenId === adv.tokenId) {
                    isOwner = true;
                }
            });
            return isOwner;
        }

        return false;
    };

    @action fetchUserAdventurers = async () => {
        const responseArr = [];
        const url = urlSearchBuilder(`${settings.API_URL}/adventurers`, "", ADVENTURER_SEARCH_FIELDS.TOKEN_ID, {
            isUserQuery: true,
        });
        const response = await fetch(url);
        const adventurers = await response.json();
        if (adventurers?.rows) {
            return adventurers.rows;
        }
        return responseArr;
    };

    @action fetchMultipleMetadata = async (tokenIds: number[]) => {
        const responseArr = [];
        let tokenStr = "";
        for (let i = 0; i < tokenIds.length; i++) {
            tokenStr += `${tokenIds[i]} `;
            // const map = await fetch(`metadata/${tokenIds[i]}`);
            // if (map.status === 404) {
            //   continue;
            // }

            // const mapJson: IMapD = await map.json();
            // responseArr.push(mapJson);
        }

        const url = urlSearchBuilder(`${settings.API_URL}/adventurers`, tokenStr, ADVENTURER_SEARCH_FIELDS.TOKEN_ID, {
            isUserQuery: true,
        });
        const response = await fetch(url);
        const adventurers = await response.json();
        if (adventurers?.rows) {
            return adventurers.rows;
        }
        return responseArr;
    };

    @action loadUserAdventurers = async () => {
        if (!this.userAdventurersLoaded) {
            if (!this.contract) {
                await this.initializeContract();
            }
            this.loadingUserAdventurers = true;
            const {
                accountStore: { user },
            } = this.rootStore;
            if (user) {
                //this.userAdventurerTokens = new Set<number>(uris?.adventurers?.map((a) => a[0]));

                const adventurers = await this.fetchUserAdventurers();
                adventurers.forEach((adventurer) => {
                    try {
                        this.userAdventurers.push(adventurer);
                    } catch {
                        console.warn("User adventurers not set");
                    }
                });
                this.userAdventurers = adventurers;
                this.userAdventurersLoaded = true;
            }

            this.loadingUserAdventurers = false;
        }
    };

    @action search = (value: string) => {
        this.filter.search = value;
    };

    @action searchCategory = (value: SearchableFields) => {
        this.filter.searchCategory = value;
        if (value === "glitch") {
            this.search("Glitch: Ascii,Glitch: CGA,Glitch: Graph Paper,Glitch: Terminal,Glitch: Rainbow");
        }
    };

    @action filterOptions = (value: SearchOptions) => {
        this.filter.options = value;
    };

    @action orderBy = (value: OrderByOptions) => {
        this.filter.orderBy = value;
    };

    @action orderDirection = (value: "asc" | "desc") => {
        this.filter.orderDirection = value;
    };

    @computed get adventurersList() {
        return Array.from(this.userAdventurers.values());
    }

    getAdventurer = computedFn(async (tokenId: number) => {
        const adventurers = await this.fetchMultipleMetadata([tokenId]);
        return adventurers[0] ?? undefined;
    });

    redeemRewards = async () => {
        // const signer = this.web3Store.injectedProvider.getSigner();
        // const rewards = await redeemRewards();
        // console.log(this.web3Store.activeAddress);
        // this.tokenContract.methods
        //     .getGold(rewards.pendingRewards[0].issueAmount, rewards.pendingRewards[0].signature)
        //     .send({
        //         from: this.web3Store.activeAddress,
        //     });
        // const goldTxn = await this.tokenContract
        //     .connect(signer)
        //     .functions.getGold(rewards.pendingRewards[0].issueAmount, rewards.pendingRewards[0].signature);
        // await goldTxn.wait();
    };
}
