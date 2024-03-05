import { ethers } from "ethers";

export const getHasAccount = async (provider: any): Promise<string | null> => {
    if (provider) {
        try {
            const [address] = await provider.listAccounts();
            if (address) {
                return address;
            }
        } catch {
            console.warn("Error loading wallet address");
        }
    }

    return null;
};

export const getUniversalProvider = (provider: any): ethers.providers.Web3Provider | null => {
    if (provider) {
        const p = new ethers.providers.Web3Provider(provider);
        return p;
    }

    return null;
};
