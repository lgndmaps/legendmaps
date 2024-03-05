import { LEGEND_MAPS_ABI, ADVENTURERS_ABI } from "../contracts/LMAbis/abis";
import * as OPERATOR_ABI from "../contracts/LMAbis/LegendCoin.json";
import * as POWERUP_ABI from "../contracts/LMAbis/LegendPowerUps.json";
import { BigNumber, Contract, ethers, Signer } from "ethers";
import { BaseProvider } from "@ethersproject/providers";
import { JsonRpcProvider } from "@ethersproject/providers";
import { Adventurer, RewardRequests } from "../models";
import { ADVENTURER_PROJECTS } from "../constants/adventurers";
import { settings } from "../settings";
import { powerups } from "../game_engine/character/data/powerups";
import { randomInt } from "crypto";

const zip = require("lodash.zip");

let provider = null;

export const LEGENDMAPS_CONTRACT_ADDRESS: { [chainId: number]: string } = {
    4: `0xBFf184118BF575859Dc6A236E8C7C4F80Dc7c25c`,
    1: `0xBFf184118BF575859Dc6A236E8C7C4F80Dc7c25c`,
};

export const ADVENTURERS_CONTRACT_ADDRESS: { [chainId: number]: string } = {
    4: `0xCA72feCc4BDb993650654A9881F2Be15a7875796`,
    1: `0xCA72feCc4BDb993650654A9881F2Be15a7875796`,
};

export const PARTNER_CONTRACT_ADDRESSES = {
    [ADVENTURER_PROJECTS.FORGOTTEN_RUNES_WIZARDCULT]: "0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42",
    [ADVENTURER_PROJECTS.CRYPTO_COVEN]: "0x5180db8F5c931aaE63c74266b211F580155ecac8",
    [ADVENTURER_PROJECTS.LOOT]: "0xFF9C1b15B16263C61d017ee9F65C50e4AE0113D7",
};

const operatorAddress = settings.TOKEN_CONTRACT_ADDRESS;
const operatorChainId = settings.TOKEN_CHAIN_ID;

const powerupAddress = settings.POWERUP_CONTRACT_ADDRESS;

// EIP-712 domain config
const domain = {
    // Name and version must match contract variables
    name: "LegendCoin",
    version: "1",
    verifyingContract: operatorAddress,
    chainId: operatorChainId,
};

// Create a provider, can be any RPC based provider, we use the RPC URL from .env
const operatorProvider = new ethers.providers.JsonRpcProvider(
    process.env.POLYGON_RPC_URL || "",
    operatorChainId,
);

// Create a signer from a private key. The signers public key must be added to the contract.
const operatorSigner = new ethers.Wallet(process.env.CONTRACT_PRIVATE_KEY, operatorProvider);

// Create a contract instance to read state from (used to grab the players latest nonce)
const operatorContract = new ethers.Contract(operatorAddress, OPERATOR_ABI.abi, operatorProvider);
const powerupContract = new ethers.Contract(powerupAddress, POWERUP_ABI.abi, operatorProvider);

export async function getLegendMapsContract({ provider }: { provider: any }) {
    const { chainId } = await provider.getNetwork();
    const legendmapsAddress = LEGENDMAPS_CONTRACT_ADDRESS[chainId];
    if (!legendmapsAddress) {
        throw new Error("Specify contract address");
    }
    return new ethers.Contract(legendmapsAddress, LEGEND_MAPS_ABI, provider);
}

export async function getAdventurersContract({ provider }: { provider: any }) {
    const { chainId } = await provider.getNetwork();
    const adventurersAddress = ADVENTURERS_CONTRACT_ADDRESS[chainId];
    if (!adventurersAddress) {
        throw new Error("Specify contract address");
    }
    return new ethers.Contract(adventurersAddress, ADVENTURERS_ABI, provider);
}

export async function getProjectContract({ provider, project }: { provider: any; project: string }) {
    const { chainId } = await provider.getNetwork();
    const address = PARTNER_CONTRACT_ADDRESSES[project];
    if (!address) {
        throw new Error("Specify contract address");
    }
    return new ethers.Contract(
        address,
        [
            "function balanceOf(address owner) public view returns (uint256)",
            "function ownerOf(uint256 tokenId) public view returns (address)",
            "function tokenOfOwnerByIndex(address owner, uint256 index) public view returns (uint256)",
        ],
        provider,
    );
}

export async function checkProjectOwnership(project: string, mainProvider: BaseProvider, address: string) {
    const contract = await getProjectContract({
        provider: mainProvider,
        project: project,
    });
    const balance = await contract.balanceOf(address);

    return !balance.isZero();
}

export async function getTokenOwnerByProject(project: string, mainProvider: BaseProvider, tokenId: number) {
    const contract = await getProjectContract({
        provider: mainProvider,
        project: project,
    });

    const owner = await contract.ownerOf(tokenId);

    return owner.toLocaleLowerCase();
}

export async function checkAdventurerOwnership(mainProvider: BaseProvider, address: string, tokenId: number) {
    const contract = await getAdventurersContract({
        provider: mainProvider,
    });
    const owner = await contract.ownerOf(tokenId);
    owner.toLocaleLowerCase() === address.toLocaleLowerCase();

    return owner.toLocaleLowerCase() === address.toLocaleLowerCase();
}

export async function checkAdventurerOwnershipDB(address: string, tokenId: number) {
    const adv = await Adventurer.findByPk(tokenId);
    if (!adv) {
        return false;
    }

    return adv.owner.toLocaleLowerCase() === address.toLocaleLowerCase();
}

export async function getTokenOwner(mainProvider: BaseProvider, tokenId: number) {
    const contract = await getAdventurersContract({
        provider: mainProvider,
    });
    const owner = await contract.ownerOf(tokenId);

    return owner.toLocaleLowerCase();
}

export async function getMapOwner(mainProvider: BaseProvider, tokenId: number) {
    const contract = await getLegendMapsContract({
        provider: mainProvider,
    });
    const owner = await contract.ownerOf(tokenId);

    return owner.toLocaleLowerCase();
}

export async function getHasPowerup(address: string, powerupId: number): Promise<boolean> {
    const balance = await powerupContract.balanceOf(address, powerupId);
    return balance > 0;
}

export async function getRandomPowerup(address: string): Promise<number | null> {
    const balance = await powerupContract.balanceOfBatch(
        powerups.map((p) => address),
        powerups.map((p) => p.id),
    );
    const powerupIds = [];
    balance.map((b, index) => {
        if (b.toNumber() > 0) {
            powerupIds.push(powerups[index].id);
        }
    });
    return powerupIds.length === 0 ? null : powerupIds[randomInt(powerupIds.length)];
}

export async function getTokensAndUrisForAddress(
    contract: Contract,
    address: string,
    provider: BaseProvider,
): Promise<any[]> {
    const balance = await contract.balanceOf(address);
    const tokens = [];
    for (let i = 0; i < balance; i++) {
        const token = await contract.tokenOfOwnerByIndex(address, i);
        tokens.push(token);
    }
    //   const tokenURIs = await fetchTokenUrisViaMultiCall(provider, contract.address, tokens);

    return zip(tokens.map((id: BigNumber) => id.toNumber()));
}

export async function getMapTokenUris(mainProvider: BaseProvider, address: string) {
    const legendMapsContract = await getLegendMapsContract({
        provider: mainProvider,
    });

    const tokensAndUris = await Promise.all([getTokensAndUrisForAddress(legendMapsContract, address, mainProvider)]);

    const tokenData = {
        legendmaps: tokensAndUris[0],
    };

    return tokenData;
}

export async function getAdventurerTokenUris(mainProvider: BaseProvider, address: string) {
    const adventurersContract = await getAdventurersContract({
        provider: mainProvider,
    });

    const tokensAndUris = await Promise.all([getTokensAndUrisForAddress(adventurersContract, address, mainProvider)]);

    const tokenData = {
        adventurers: tokensAndUris[0],
    };

    return tokenData;
}

export async function getCCTokenUris(mainProvider: BaseProvider, address: string) {
    const contract = await getProjectContract({
        provider: mainProvider,
        project: ADVENTURER_PROJECTS.CRYPTO_COVEN,
    });

    const tokensAndUris = await Promise.all([getTokensAndUrisForAddress(contract, address, mainProvider)]);

    const tokenData = {
        adventurers: tokensAndUris[0],
    };

    return tokenData;
}

export async function getFRWCTokenUris(mainProvider: BaseProvider, address: string) {
    const contract = await getProjectContract({
        provider: mainProvider,
        project: ADVENTURER_PROJECTS.FORGOTTEN_RUNES_WIZARDCULT,
    });

    const tokensAndUris = await Promise.all([getTokensAndUrisForAddress(contract, address, mainProvider)]);

    const tokenData = {
        adventurers: tokensAndUris[0],
    };

    return tokenData;
}

class StaticJsonRpcProvider extends ethers.providers.JsonRpcProvider {
    async getNetwork(): Promise<ethers.providers.Network> {
        if (this._network) {
            return Promise.resolve(this._network);
        }
        return super.getNetwork();
    }
}

export function getProvider() {
    if (!provider) {
        provider = new StaticJsonRpcProvider(
            process.env.SERVER_PROVIDER_URL || "",
        );
    }

    return provider;
}

export async function getCurrentNonce(player: string) {
    let nonce = await operatorContract.claimNonces(player);
    return nonce.toNumber();
}

export async function generateTokenContractSignature(issueQty: BigNumber, player: string, userId: number) {
    // The signed data type to get hashed
    const types = {
        ClaimLegendCoin: [
            { name: "player", type: "address" },
            { name: "amount", type: "uint256" },
            { name: "nonce", type: "uint256" },
        ],
    };

    // Get the current nonce from the contract
    let nonce = await operatorContract.claimNonces(player);
    let nonceValue = nonce.toNumber();

    //check contract nonce against nonces in db
    const highestRewardNonce = await RewardRequests.max("nonce", { where: { userId } });

    if (highestRewardNonce !== null) {
        if (nonceValue <= highestRewardNonce) {
            nonceValue++;
        }
    }

    const finalNonce = ethers.BigNumber.from(nonceValue);
    // Create the data to  be hashed
    const data = {
        player,
        amount: issueQty,
        nonce: finalNonce,
    };

    // Generate the signature from the typed data using ethers.js
    const signature = await operatorSigner._signTypedData(domain, types, data);

    return { signature, nonce: finalNonce };
}
