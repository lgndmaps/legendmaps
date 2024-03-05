import {StaticJsonRpcProvider} from "@ethersproject/providers";
import {action, makeObservable, observable} from "mobx";
import settings from "../settings";
import {RootStore} from "./RootStore";
import {Contract} from "ethers";
import {MerkleTree} from "merkletreejs";
import Web3 from "web3";
import {IMapD, OrderByOptions, SearchableFields, SearchOptions} from "../types/mapTypes";
import {urlSearchBuilder} from "../util/urlBuilders";
import {ORDER_BY, SEARCH_FIELDS, searchByOptions} from "../constants/mapsConstants";
import {IMapMetaD} from "../types/metaMapTypes";

export const LEGENDMAPS_CONTRACT_ADDRESS: { [chainId: number]: string } = {
    1: `0xBFf184118BF575859Dc6A236E8C7C4F80Dc7c25c`,
};

const defaultFilter: MapSearchFilter = {
    search: "",
    searchCategory: searchByOptions[0].value,
    options: [],
    orderBy: ORDER_BY.TOKEN_ID,
    orderDirection: "asc",
};

export type MapSearchFilter = {
    search: string;
    searchCategory: SearchableFields;
    options: SearchOptions;
    orderBy: OrderByOptions;
    orderDirection: "asc" | "desc";
};

export class MapsStore {
    private rootStore: RootStore;
    @observable contractLoaded: boolean;
    @observable loadingContract: boolean;
    @observable networkId: number;
    @observable contractAddress: string;
    @observable defaultProvider: StaticJsonRpcProvider;
    @observable contract: Contract;
    @observable userMaps: Array<IMapD> = [];
    @observable loadingUserMaps: boolean = false;
    @observable filter: MapSearchFilter;

    web3: Web3;
    merkleTree: MerkleTree;
    totalSupply: number;
    supplyRemaining: number;

    constructor(_rootStore: RootStore) {
        makeObservable(this);
        this.rootStore = _rootStore;
        this.filter = defaultFilter;
    }

    @action initializeContract = async () => {
    };

    @action fetchUserMaps = async (publicAddress: string) => {
        const responseArr = [];
        let tokenStr = "";

        const url = urlSearchBuilder(`${settings.API_URL}/maps`, tokenStr, SEARCH_FIELDS.TOKEN_ID, {
            isUserQuery: true,
            publicAddress,
        });
        const response = await fetch(url);
        const maps = await response.json();
        if (maps?.rows) {
            return maps.rows;
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

        const url = urlSearchBuilder(`${settings.API_URL}/maps`, tokenStr, SEARCH_FIELDS.TOKEN_ID, {});
        const response = await fetch(url);
        const maps = await response.json();
        if (maps?.rows) {
            return maps.rows;
        }
        return responseArr;
    };

    @action fetchSingle = async (tokenId: number) => {
        if (tokenId !== undefined && tokenId >= 0) {
            try {
                const map = await fetch(`${settings.API_URL}/maps/${tokenId}`);
                if (map.status === 404) {
                    return {
                        notFound: true,
                    };
                }

                const apiMap = await map.json();
                const mapJson: IMapD = apiMap;
                const mapMetaJson: IMapMetaD = JSON.parse(mapJson.details);
                //Pull stats
                return {
                    mapJson,
                    mapMetaJson,
                };
            } catch (e) {
                console.log("Failed to fetch map",
                    tokenId, e);
                return {
                    notFound: true,
                };
            }
        }
    };

    @action loadUserMaps = async () => {
        this.loadingUserMaps = true;

        const {
            accountStore: {user},
        } = this.rootStore;
        if (user) {
            const maps = await this.fetchUserMaps(user.publicAddress);
            this.userMaps = maps;
        }

        this.loadingUserMaps = false;
    };

    @action search = (value: string) => {
        this.filter.search = value;
    };

    @action searchCategory = (value: SearchableFields) => {
        this.filter.searchCategory = value;
    };

    @action filterOptions = (value: SearchOptions) => {
        this.filter.options = value;
    };

    @action orderBy = (value: OrderByOptions) => {
        console.trace("setting order");
        this.filter.orderBy = value;
    };

    @action orderDirection = (value: "asc" | "desc") => {
        this.filter.orderDirection = value;
    };
}
