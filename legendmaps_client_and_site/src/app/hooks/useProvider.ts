import settings from "../../settings";
import { ethers } from "ethers";
import { SignatureType, SiweMessage } from "../../packages/siwe/siwe";
import { useRootStore } from "../../store";

declare global {
    interface Window {
        //ethereum: { request: (opt: { method: string }) => Promise<Array<string>> };
        web3: unknown;
    }
}

const enum Providers {
    METAMASK = "metamask",
    WALLET_CONNECT = "walletconnect",
}

let provider = null;

class StaticJsonRpcProvider extends ethers.providers.JsonRpcProvider {
    async getNetwork(): Promise<ethers.providers.Network> {
        if (this._network) {
            return Promise.resolve(this._network);
        }
        return super.getNetwork();
    }
}

export function getProvider(forceMainnet: boolean = false) {
    if (!provider) {
        provider = new StaticJsonRpcProvider(
            forceMainnet ? settings.MAINNET_INFURA_URL : settings.PROVIDER_URLS.public,
        );
    }

    return provider;
}

const useProvider = (forceMainnet: boolean = false) => {
    return null;
};

export default useProvider;
