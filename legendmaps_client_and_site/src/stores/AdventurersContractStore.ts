import { StaticJsonRpcProvider } from "@ethersproject/providers";
import { computed, action, observable, makeObservable, runInAction } from "mobx";
import settings from "../settings";
import useProvider from "../app/hooks/useProvider";
import { RootStore } from "./RootStore";
import { BigNumber, Contract, ContractInterface, ethers } from "ethers";
import LMContract from "../assets/contractABIs/LMAdventurers.json";
import { convertBigNumber } from "../util/ethers";
import whitelist from "../assets/whitelistData/whitelistfinal.json";
import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";
import Web3 from "web3";
import zip from "lodash/zip";

export class AdventurersContractStore {
    private rootStore: RootStore;
    @observable contractLoaded: boolean;
    @observable loadingContract: boolean;
    @observable networkId: number;
    @observable contractAddress: string;
    @observable defaultProvider: StaticJsonRpcProvider;
    @observable contract: Contract;
    @observable _whitelistActive: boolean;
    @observable _saleActive: boolean;
    @observable mintPrice: number;
    @observable remainingMints: number = -1;
    @observable processingMint: boolean = false;
    @observable success: boolean = false;
    web3: Web3;
    merkleTree: MerkleTree;
    totalSupply: number;
    supplyRemaining: number;

    constructor(_rootStore: RootStore) {
        makeObservable(this);
        this.rootStore = _rootStore;
    }

    hashToken = (address: any, amount: number) => {
        const value = this.web3.utils.soliditySha3({ t: "address", v: address }, { t: "uint256", v: amount });
        return value;
    };

    generateMerkleTree = (addresses: any) => {
        const merkleTree = new MerkleTree(
            Object.entries(addresses).map((token) =>
                //@ts-ignore
                this.hashToken(...token),
            ),
            keccak256,
            { sortPairs: true },
        );

        return merkleTree;
    };

    @action initializeContract = async () => {};

    @action loadContractData = async () => {};

    @computed get whitelistActive() {
        return this._whitelistActive;
    }

    @computed get saleActive() {
        return this._saleActive;
    }

    getSupply = async () => {
        const supply = await this.contract.functions.LMA_SUPPLY();
        const remaining = await this.contract.functions.totalSupply();
        const price = await this.contract.functions.LMA_PRICE();

        runInAction(() => {
            this.mintPrice = price;
            this.totalSupply = supply;
            this.supplyRemaining = this.totalSupply - remaining;
        });
    };

    getSaleState = async () => {
        const wlState = await this.contract.whitelistLive();
        const saleState = await this.contract.saleLive();
        runInAction(() => {
            this._whitelistActive = wlState;
            this._saleActive = saleState;
        });
    };

    @action getRemainingMints = async (address: string) => {
        if (whitelist.hasOwnProperty(address.toLowerCase()) && !this.whitelistActive && !this.saleActive) {
            this.remainingMints = whitelist[address.toLowerCase()];
        } else if (whitelist.hasOwnProperty(address.toLowerCase())) {
            console.log(whitelist[address.toLowerCase()]);
            const remaining = await this.contract.getMintsRemaining(
                address.toLowerCase(),
                whitelist[address.toLowerCase()],
            );
            this.remainingMints = convertBigNumber(remaining);
        } else {
            this.remainingMints = -1;
        }
    };

    checkOnWhitelist = (address: string) => {
        return whitelist[address.toLowerCase()] !== undefined;
    };

    @action getNumMints = (address: string) => {
        return whitelist[address.toLowerCase()];
    };

    @action getMerkleProof = async (address: string) => {
        const proof = this.merkleTree.getHexProof(
            this.hashToken(address.toLowerCase(), whitelist[address.toLowerCase()]),
        );
        return { proof, maxMints: whitelist[address.toLowerCase()] };
    };

    @action processMint = async (mintAmount: number) => {
        // this.success = false;
        // const signer = this.web3Store.injectedProvider.getSigner();
        // const value = (this.mintPrice / 10 ** 18) * mintAmount;
        // this.processingMint = true;
        // if (!!this.whitelistActive) {
        //     const proof = this.merkleTree.getHexProof(
        //         this.hashToken(
        //             this.web3Store.activeAddress.toLowerCase(),
        //             whitelist[this.web3Store.activeAddress.toLowerCase()],
        //         ),
        //     );
        //     try {
        //         const mintTxn = await this.contract
        //             .connect(signer)
        //             .functions.whitelistMint(mintAmount, whitelist[this.web3Store.activeAddress.toLowerCase()], proof, {
        //                 value: ethers.utils.parseEther(value.toString()),
        //             });
        //         await mintTxn.wait();
        //     } catch {
        //         this.processingMint = false;
        //     }
        // } else if (!!this.saleActive) {
        //     try {
        //         const mintTxn = await this.contract
        //             .connect(signer)
        //             .functions.mint(mintAmount, { value: ethers.utils.parseEther(value.toString()) });
        //         await mintTxn.wait();
        //     } catch {
        //         this.processingMint = false;
        //     }
        // }
        // this.success = true;
        // this.getRemainingMints(this.web3Store.activeAddress);
        // this.processingMint = false;
    };

    @action getTokensAndUrisForAddress = async (address: string) => {
        if (this.contract) {
            const balance = await this.contract.balanceOf(address);
            const tokens = [];
            for (let i = 0; i < balance; i++) {
                const token = await this.contract.tokenOfOwnerByIndex(address, i);
                tokens.push(token);
            }
            //   const tokenURIs = await fetchTokenUrisViaMultiCall(provider, contract.address, tokens);

            return zip(tokens.map((id: BigNumber) => id.toNumber()));
        }
    };

    @action getTokenUris = async (address: string) => {
        const tokensAndUris = await Promise.all([this.getTokensAndUrisForAddress(address)]);

        const tokenData = {
            adventurers: tokensAndUris[0],
        };

        return tokenData;
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
    };
}
