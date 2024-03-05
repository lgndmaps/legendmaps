import { css } from "@emotion/react";
import { useContext, useState } from "react";
import {
    useAccount,
    useContract,
    useContractWrite,
    useNetwork,
    usePrepareContractWrite,
    useProvider,
    useSigner,
    useSwitchNetwork,
} from "wagmi";
import settings from "../../../settings";
import { RootStoreContext } from "../../../stores/with-root-store";
import { PendingReward, RewardRequests } from "../../../types/userTypes";
import Button from "../ui/Button";
import TokenContract from "../../../assets/contractABIs/LegendCoin.json";
import { sum } from "lodash";
export type ClaimedRewardProps = {
    reward: RewardRequests;
    onClaimCompleted?: () => void;
};

export const ClaimedReward = ({ reward, onClaimCompleted }: ClaimedRewardProps) => {
    const network = useNetwork();
    const { switchNetworkAsync } = useSwitchNetwork();

    const { accountStore, errorStore } = useContext(RootStoreContext);
    const [isRedeemingReward, setRedeemingReward] = useState<boolean>(false);
    const { data: signer } = useSigner();

    const contract = useContract({
        addressOrName: settings.COIN_ADDRESS,
        contractInterface: TokenContract,
        signerOrProvider: signer,
    });

    const processTransaction = async () => {
        try {
            setRedeemingReward(true);
            const goldAmount = sum(reward.consumedRewards.map((r) => r.issueAmount));
            const claimLegendCoinTxn = await contract.claimLegendCoin(goldAmount, reward.signature);
            await claimLegendCoinTxn.wait();
            accountStore.setCurrencyBalance("gold", accountStore.currencyBalances.gold + goldAmount);
            onClaimCompleted();
            setRedeemingReward(false);
        } catch (e) {
            console.error(e);
            setRedeemingReward(false);
        }
    };
    return (
        <div
            css={css`
                display: flex;
                flex-direction: column;
                margin: 5px 0;
                padding: 20px 0;
                &:not(:last-of-type) {
                    border-bottom: 1px solid #fff;
                }
                & > div {
                    margin-bottom: 10px;
                    &:not(:last-of-type) {
                        margin-right: 10px;
                    }
                }
                margin-bottom: 10px;
            `}
        >
            <div>
                <strong>Claimed Rewards:</strong>{" "}
            </div>
            <div
                css={css`
                    margin-left: 10px;
                `}
            >
                {reward.consumedRewards
                    .map((r) => {
                        return `${r.source}: ${r.issueAmount}`;
                    })
                    .join(", ")}
            </div>
            <div>
                <strong>Gold Amount:</strong>{" "}
                {reward.consumedRewards.map((r) => r.issueAmount).reduce((partialSum, a) => partialSum + a, 0)}
            </div>
            <div>
                <strong>Signature:</strong> {reward.signature}
            </div>
            <div>
                <strong>Nonce:</strong> {reward.nonce}
            </div>

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
                {isRedeemingReward ? "Retrying..." : "Retry Redemption"}
            </Button>
        </div>
    );
};
