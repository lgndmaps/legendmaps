import { useContext, useState } from "react";
import { useContract, useContractWrite, useNetwork, usePrepareContractWrite, useSigner, useSwitchNetwork } from "wagmi";
import settings from "../../../settings";
import { RootStoreContext } from "../../../stores/with-root-store";
import Button from "../ui/Button";
import PowerUpContract from "../../../assets/contractABIs/LegendPowerUps.json";

export const RedeemPowerups = ({}) => {
    const [isRedeemingReward, setRedeemingReward] = useState<boolean>(false);
    const network = useNetwork();
    const { chains, error, isLoading: isLoadingNewNetwork, pendingChainId, switchNetworkAsync } = useSwitchNetwork();
    const { data: signer } = useSigner();

    const { accountStore } = useContext(RootStoreContext);
    const { gold } = accountStore.currencyBalances;
    const possiblePowerups = Math.floor(gold / settings.POWERUP_COST);

    const contract = useContract({
        addressOrName: settings.POWERUP_CONTRACT_ADDRESS,
        contractInterface: PowerUpContract.abi,
        signerOrProvider: signer,
    });

    const processTransaction = async () => {
        try {
            setRedeemingReward(true);
            const amount = possiblePowerups;
            const claimPowerupTxn = await contract.purchasePowerUp(amount, { gasLimit: 200000 });
            await claimPowerupTxn.wait();
            setRedeemingReward(false);
            window.location.reload();
        } catch (e) {
            console.error(e);
        }
    };
    if (possiblePowerups) {
        return (
            <div>
                <Button
                    disabled={isRedeemingReward}
                    onClick={async () => {
                        if (network.chain.id !== settings.TOKEN_CONTRACT_CHAIN_ID) {
                            const newChain = await switchNetworkAsync(settings.TOKEN_CONTRACT_CHAIN_ID);
                            if (newChain.id === settings.TOKEN_CONTRACT_CHAIN_ID) {
                                await processTransaction();
                            }
                        } else {
                            await processTransaction();
                        }
                    }}
                >
                    Mint {possiblePowerups} Powerups
                </Button>
            </div>
        );
    }

    return <div>You can't mint any powerups right now. Play Legend Maps to earn more currency.</div>;
};
