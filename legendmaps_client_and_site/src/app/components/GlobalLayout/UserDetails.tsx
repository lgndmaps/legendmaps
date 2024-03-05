import * as React from "react";
import { v4 as uuidv4 } from "uuid";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useRootStore } from "../../../store";
import Button from "../ui/Button";
import styled from "styled-components";
import { breakpoints, useBreakpoints } from "../../../styles/styleUtils";
import DropDownMenu from "../ui/DropDownMenu/DropDownMenu";
import { IHeaderNavLink } from "./Header";
import { StyledMenuItem } from "../ui/DropDownMenu/DropDownMenu.styled";
import { useAuth } from "../../hooks/useAuth";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { css } from "@emotion/react";
import { useAccount, useBalance, useContract, useContractRead, useSigner, useToken } from "wagmi";
import settings from "../../../settings";
import LegendCoinContract from "../../../assets/contractABIs/LegendCoin.json";
import LegendPowerupContract from "../../../assets/contractABIs/LegendPowerUps.json";
import { BigNumber } from "ethers";
import { powerups } from "../../../assets/data/powerups";

const UserDetailsWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    @media (max-width: ${breakpoints.tablet}) {
        align-items: flex-start;
    }
    .spacer {
        height: 15px;
    }
`;

interface DetailsProps {
    handleClick: () => void;
}

const UserDetails = observer(({ handleClick }: DetailsProps) => {
    const {
        accountStore,
        accountStore: { user, logout },
    } = useRootStore();

    const { isTabletCeil } = useBreakpoints();

    const accountLinkArray: IHeaderNavLink[] = [
        { name: "Profile", url: "/profile" },
        { name: "Rewards", url: "/rewards" },
        { name: "Verify Discord Role", url: "/verify" },
    ];

    const { address } = useAccount();
    const contractRead = useContractRead({
        addressOrName: settings.COIN_ADDRESS,
        contractInterface: LegendCoinContract,
        functionName: "balanceOf",
        chainId: settings.TOKEN_CONTRACT_CHAIN_ID,
        args: [address],
        onSettled(data, error) {
            if (!error) {
                const dataValue = data as unknown;
                const currencyAmount = dataValue as BigNumber;
                accountStore.setCurrencyBalance("gold", currencyAmount.toNumber());
            }
        },
    });

    const powerupRead = useContractRead({
        addressOrName: settings.POWERUP_CONTRACT_ADDRESS,
        contractInterface: LegendPowerupContract.abi,
        functionName: "balanceOfBatch",
        chainId: settings.TOKEN_CONTRACT_CHAIN_ID,
        args: [powerups.map((p) => address), powerups.map((p) => p.id)],
        onSettled(data, error) {
            if (!error) {
                const dataValue = data as any;
                accountStore.setPowerupsBalance(dataValue);
            }
        },
    });

    return (
        <UserDetailsWrapper>
            <>
                <ConnectButton.Custom>
                    {({
                        account,
                        chain,
                        openAccountModal,
                        openChainModal,
                        openConnectModal,
                        authenticationStatus,
                        mounted,
                    }) => {
                        const ready = mounted && authenticationStatus !== "loading";
                        const connected =
                            ready &&
                            account &&
                            chain &&
                            (!authenticationStatus || authenticationStatus === "authenticated");

                        return (
                            <div
                                {...(!ready && {
                                    "aria-hidden": true,
                                    style: {
                                        opacity: 0,
                                        pointerEvents: "none",
                                        userSelect: "none",
                                    },
                                })}
                            >
                                {(() => {
                                    if (!connected) {
                                        return <Button onClick={openConnectModal}>Connect Wallet</Button>;
                                    }

                                    if (chain.unsupported) {
                                        return <Button onClick={openChainModal}>Wrong network</Button>;
                                    }

                                    return (
                                        <DropDownMenu title="My Account" rightOffset={0}>
                                            {/* <StyledMenuItem className="wallet-info">
                                                Account Name: {user?.username}
                                            </StyledMenuItem>
                                            <StyledMenuItem className="wallet-info">
                                                Wallet connected: ${web3Store?.activeAddress?.toString()?.slice(0, 8)}
                                            </StyledMenuItem> */}
                                            {!isTabletCeil && <div className="spacer" />}
                                            <StyledMenuItem>
                                                <div style={{ display: "flex", gap: 12 }}>
                                                    <div onClick={openChainModal}>Network: {chain.name}</div>
                                                </div>
                                            </StyledMenuItem>
                                            {accountStore.currencyBalances.gold && (
                                                <StyledMenuItem>
                                                    <div style={{ display: "flex", gap: 12 }}>
                                                        <div>LegendCoin: {accountStore.currencyBalances.gold}</div>
                                                    </div>
                                                </StyledMenuItem>
                                            )}

                                            <StyledMenuItem>
                                                <div onClick={openAccountModal}>{account.displayName}</div>
                                            </StyledMenuItem>
                                            {accountLinkArray.map((link) => (
                                                <StyledMenuItem key={link.name}>
                                                    {link.onClick ? (
                                                        <div onClick={link.onClick}>{link.name}</div>
                                                    ) : (
                                                        <Link href={link.url}>{link.name}</Link>
                                                    )}
                                                </StyledMenuItem>
                                            ))}
                                            <StyledMenuItem key={"logout"}>
                                                <div onClick={openAccountModal}>Logout</div>
                                            </StyledMenuItem>
                                        </DropDownMenu>
                                    );
                                })()}
                            </div>
                        );
                    }}
                </ConnectButton.Custom>
            </>
        </UserDetailsWrapper>
    );
});

export default UserDetails;
