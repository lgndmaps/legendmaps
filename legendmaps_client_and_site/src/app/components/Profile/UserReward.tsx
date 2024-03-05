import { css } from "@emotion/react";
import { useContext, useState } from "react";
import { useContract, useContractWrite, useNetwork, usePrepareContractWrite, useSigner, useSwitchNetwork } from "wagmi";
import settings from "../../../settings";
import { RootStoreContext } from "../../../stores/with-root-store";
import { PendingReward, RewardRequests } from "../../../types/userTypes";
import Button from "../ui/Button";
import TokenContract from "../../../assets/contractABIs/LegendCoin.json";
import { sum } from "lodash";

export type UserRewardProps = {
    reward: PendingReward;
    allowClaim: boolean;
    onRewardClaimed: (rewards: RewardRequests[]) => void;
};

export const UserReward = ({ reward, onRewardClaimed, allowClaim }: UserRewardProps) => {
    const network = useNetwork();
    const { chains, error, isLoading: isLoadingNewNetwork, pendingChainId, switchNetworkAsync } = useSwitchNetwork();

    const { data: signer } = useSigner();

    const { accountStore, errorStore } = useContext(RootStoreContext);
    const { user } = accountStore;
    const [isRedeemingReward, setRedeemingReward] = useState<boolean>(false);

    const contract = useContract({
        addressOrName: settings.COIN_ADDRESS,
        contractInterface: TokenContract,
        signerOrProvider: signer,
    });

    const processRedeemAll = async () => {
        try {
            setRedeemingReward(true);
            const rewards = await accountStore.redeemAllReward();
            if (typeof rewards !== "object") {
                onRewardClaimed(rewards);
            }
            const goldAmount = sum(rewards[0].consumedRewards.map((r) => r.issueAmount));
            const claimLegendCoinTxn = await contract.claimLegendCoin(goldAmount, rewards[0].signature);
            await claimLegendCoinTxn.wait();
            accountStore.setCurrencyBalance("gold", accountStore.currencyBalances.gold + goldAmount);
            //@ts-ignore
            onRewardClaimed(rewards);
            setRedeemingReward(false);
        } catch (e) {
            console.error(e);
            window.location.reload();
            setRedeemingReward(false);
        }
    };

    return (
        <div
            css={css`
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin: 5px 0;
                padding: 20px 0;

                &:not(:last-of-type) {
                    border-bottom: 1px solid #fff;
                }

                & > div {
                    &:not(:last-of-type) {
                        margin-right: 10px;
                    }
                }
            `}
        >
            {reward.id !== -1 && (
                <>
                    <div>
                        <div>
                            <b>{reward.source}</b>
                        </div>
                        <div>{reward.sourceDetails?.trim()}</div>
                        <div>LegendCoin Earned: {reward.issueAmount}</div>
                    </div>
                </>
            )}
            {reward.id === -1 && (
                <>
                    <Button
                        disabled={isRedeemingReward}
                        onClick={async (e) => {
                            e.preventDefault();
                            if (network.chain.id !== settings.TOKEN_CONTRACT_CHAIN_ID) {
                                const newChain = await switchNetworkAsync(settings.TOKEN_CONTRACT_CHAIN_ID);
                                if (newChain.id === settings.TOKEN_CONTRACT_CHAIN_ID) {
                                    await processRedeemAll();
                                }
                            } else {
                                await processRedeemAll();
                            }
                        }}
                    >
                        {isRedeemingReward ? "Redeeming..." : "Redeem All Rewards"}
                    </Button>
                </>
            )}
        </div>
    );
};
