import { observer } from "mobx-react-lite";
import dynamic from "next/dynamic";
import { useContext, useEffect, useState } from "react";
import { ADVENTURER_SEARCH_FIELDS } from "../../../constants/adventurerConstants";
import { MapsSelectionWrapper } from "../../../pages/maps";
import { RootStoreContext } from "../../../stores/with-root-store";
import { IMapD } from "../../../types/mapTypes";
import { PendingReward, RewardRequests } from "../../../types/userTypes";
import { fetchPendingRewards, fetchRedeemedRewards, refreshOwnedAdventurers } from "../../../util/api/GameApi";
import { css } from "@emotion/react";
import Button from "../ui/Button";
import { UserReward } from "./UserReward";
import settings from "../../../settings";
import TokenContract from "../../../assets/contractABIs/LegendCoin.json";
import { useContract, useContractWrite, usePrepareContractWrite } from "wagmi";
import { ClaimedReward } from "./ClaimedReward";
export const UserRewards = observer(() => {
    const { accountStore, errorStore } = useContext(RootStoreContext);
    const { user } = accountStore;
    const [failedRewards, setFailedRewards] = useState<RewardRequests[]>([]);
    const [pendingRewards, setPendingRewards] = useState<PendingReward[]>([]);
    const [currentNonce, setCurrentNonce] = useState<number>(0);
    const [redeemedRewards, setRedeemedRewards] = useState<RewardRequests[]>([]);
    const [showClaimedRewards, setShowClaimedRewards] = useState<boolean>(false);
    const [loadingRedeemedRewards, setLoadingRedeemedRewards] = useState<boolean>(false);

    const updateRewards = async () => {
        const rewards = await fetchPendingRewards();
        if (Array.isArray(rewards.rewards)) {
            setPendingRewards(rewards.rewards);
            setCurrentNonce(rewards.nonce);
        }
        setLoadingRedeemedRewards(true);
        const redeemedRewards = await fetchRedeemedRewards();

        if (Array.isArray(rewards.rewards)) {
            setRedeemedRewards(redeemedRewards.rewards);
        }

        setFailedRewards(redeemedRewards.rewards?.filter((r) => parseInt(r.nonce) === rewards.nonce) || []);

        setLoadingRedeemedRewards(false);
    };

    const updateFailedRewards = async () => {
        const newNonce = currentNonce + 1;
        setCurrentNonce(newNonce);
        setFailedRewards(redeemedRewards.filter((r) => parseInt(r.nonce) === currentNonce) || []);
    };

    const markRewardClaimed = (id) => {
        const pRewards = pendingRewards.filter((p) => p.id !== id);
        setPendingRewards(pRewards);
    };

    const markAllRewardsClaimed = () => {
        setPendingRewards([]);
    };

    const addRewardRequests = (rewards: RewardRequests[]) => {
        setRedeemedRewards([...redeemedRewards, ...rewards]);
    };

    useEffect(() => {
        updateRewards();
    }, [user]);

    if (!user) {
        return <>Log in to view your rewards</>;
    }

    return (
        <div>
            {pendingRewards.length === 0 && (failedRewards?.length || 0) === 0 && (
                <p>No pending rewards. Play the game to earn new rewards.</p>
            )}
            {(failedRewards?.length || 0) > 0 && (
                <>
                    <h1>Awaiting Blockchain Redemption</h1>
                    <p>
                        These are rewards where the transaction may have been cancelled or failed. They must be redeemed
                        before other rewards can be redeemed
                    </p>
                    {failedRewards.map((reward) => {
                        return <ClaimedReward reward={reward} onClaimCompleted={() => updateFailedRewards()} />;
                    })}
                </>
            )}
            {pendingRewards.length > 0 && (
                <>
                    <h1>Unclaimed Rewards</h1>
                    <UserReward
                        reward={{ id: -1 }}
                        allowClaim={failedRewards.length === 0}
                        onRewardClaimed={(rewards) => {
                            markAllRewardsClaimed();
                            addRewardRequests(rewards);
                        }}
                    />
                    {pendingRewards.map((reward) => {
                        return (
                            <UserReward
                                reward={reward}
                                allowClaim={false}
                                onRewardClaimed={(rewards) => {
                                    markRewardClaimed(reward.id);
                                    addRewardRequests(rewards);
                                }}
                            />
                        );
                    })}
                </>
            )}

            {/* <div
                css={css`
                    margin: 20px 0;
                `}
            >
                <Button onClick={() => setShowClaimedRewards(!showClaimedRewards)}>
                    {showClaimedRewards ? "Hide Claimed Rewards" : "Show Claimed Rewards"}
                </Button>
            </div> */}
            {/* {showClaimedRewards && (
                <>
                    {loadingRedeemedRewards ? (
                        <div>Loading...</div>
                    ) : (
                        <>
                            {" "}
                            <h1
                                css={css`
                                    margin-top: 30px;
                                `}
                            >
                                Claimed Rewards
                            </h1>
                            {redeemedRewards.map((reward) => {
                                return <ClaimedReward reward={reward} />;
                            })}
                        </>
                    )}
                </>
            )} */}
        </div>
    );
});
