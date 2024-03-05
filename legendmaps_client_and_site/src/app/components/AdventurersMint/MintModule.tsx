import { AnimatePresence, motion } from "framer-motion";
import { observer } from "mobx-react-lite";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { RootStoreContext } from "../../../stores/with-root-store";
import { css } from "@emotion/react";
import Title from "../ui/Title";
import settings from "../../../settings";
import { convertBigNumber } from "../../../util/ethers";

export type MintState = "whitelist" | "open" | "closed" | "sold out";

const MintModule = observer(() => {
    const {
        adventurersContractStore: contractStore,
        adventurersContractStore: {
            processMint,
            processingMint,
            remainingMints,
            totalSupply,
            supplyRemaining,
            mintPrice,
            getRemainingMints,
            success,
        },
    } = useContext(RootStoreContext);

    useEffect(() => {
        if (!contractStore.contractLoaded) {
            contractStore.loadContractData();
        }
    }, []);

    const [selectedMintAmount, setSelectedMintAmount] = useState<number>(1);

    let saleState = "closed";
    if (!contractStore.whitelistActive || !contractStore.saleActive) {
        saleState = "closed";
    }
    if (contractStore.whitelistActive) {
        saleState = "whitelist";
    }
    if (contractStore.saleActive) {
        saleState = "open";
    }
    //@ts-ignore

    if (convertBigNumber(contractStore.totalSupply) === 0) {
        saleState = "sold out";
    }

    useEffect(() => {
        // if (!contractStore.loadingContract && web3Store.activeAddress) {
        //     getRemainingMints(web3Store.activeAddress);
        // }
    }, [contractStore.loadingContract]);

    if (contractStore.loadingContract) {
        return <MintModuleWrapper>Loading...</MintModuleWrapper>;
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ ease: "linear" }}
                className="mint-purchase"
            >
                <MintModuleWrapper></MintModuleWrapper>
            </motion.div>
        </AnimatePresence>
    );
});

const MintModuleWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 300px;
`;

const MintSelectWrapper = styled.div`
    button {
        margin: 0 auto;
        width: 200px;
        text-align: center;
        padding: 10px;
        border: 1px solid #fff;
        margin-top: 15px;
    }

    display: flex;
    flex-direction: column;
    margin-bottom: 40px;
    align-items: center;

    .mint-button {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .select-amount {
        width: 200px;
        margin-bottom: 25px;
        position: relative;
        padding-top: 60px;
        .select-wrapper {
            position: relative;
            &:after {
                content: "";
                width: 10px;
                height: 10px;
                border-right: 3px solid #fff;
                border-bottom: 3px solid #fff;
                display: block;
                position: absolute;
                right: 20px;
                top: 50%;
                transform: translateY(-50%) rotate(45deg);
            }
        }

        p {
            width: 250px;
            text-align: center;
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
        }
        select {
            width: 100%;
            text-align: center;
            background: #000;
            color: #fff;
            border: 2px solid #fff;
            font-size: 1.5rem;
            -moz-appearance: none; /* Firefox */
            -webkit-appearance: none; /* Safari and Chrome */
            appearance: none;
            position: relative;
            height: 54px;
        }
    }
`;

const MintPurchaseHeader = styled.div``;

const MintSaleState = styled.div``;

const MintSupply = styled.div``;

const MintsRemainingModule = styled.div`
    font-weight: bold;
    margin-top: 20px;
`;

export default MintModule;
