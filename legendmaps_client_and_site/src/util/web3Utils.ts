import { getAddress } from "@ethersproject/address";
import { BigNumber } from "@ethersproject/bignumber";
import { BaseProvider } from "@ethersproject/providers";
import { Contract, Provider } from "ethcall";
import { LEGEND_MAPS_ABI } from "../contracts/LMAbis/abis";
import { ProjectIds } from "../types/web3";

export const PARTNER_CONTRACT_ADDRESSES = {
    frwc: "0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42",
    gawds: "0x3769c5700Da07Fe5b8eee86be97e061F961Ae340",
    fwb: "0x35bd01fc9d6d5d81ca9e055db88dc49aa2c699a8",
    cryptocoven: "0x5180db8F5c931aaE63c74266b211F580155ecac8",
};

export async function fetchTokenUrisViaMultiCall(
    mainProvider: BaseProvider,
    contractAddress: string,
    ids: BigNumber[],
) {
    const ethcallProvider = new Provider();
    await ethcallProvider.init(mainProvider);

    const contract = new Contract(contractAddress, LEGEND_MAPS_ABI);

    const data = await ethcallProvider.all(ids.map((id: BigNumber) => contract.tokenURI(id)));

    return data;
}

export async function getProjectContract({ provider, project }: { provider: any; project: string }) {
    const { chainId } = await provider.getNetwork();
    const address = PARTNER_CONTRACT_ADDRESSES[project];
    if (!address) {
        throw new Error("Specify contract address");
    }
    return new Contract(address, [
        {
            inputs: [
                {
                    internalType: "address",
                    name: "owner",
                    type: "address",
                },
            ],
            name: "balanceOf",
            outputs: [
                {
                    internalType: "uint256",
                    name: "",
                    type: "uint256",
                },
            ],
            stateMutability: "view",
            type: "function",
            constant: true,
        },
    ]);
}

export async function checkProjectOwnership(mainProvider: BaseProvider, projectId: ProjectIds, address: string) {
    if (projectId === "def") {
        return true;
    }
    const contract = await getProjectContract({
        provider: mainProvider,
        project: projectId,
    });
    const ethcallProvider = new Provider();
    await ethcallProvider.init(mainProvider);
    const data: BigNumber[] = await ethcallProvider.all([contract.balanceOf(address)]);
    if (data.length) {
        const balance = await data[0].isZero();
        return !balance;
    } else {
        return false;
    }
}
