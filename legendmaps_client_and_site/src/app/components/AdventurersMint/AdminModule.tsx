import { AnimatePresence, motion } from "framer-motion";
import { observer } from "mobx-react-lite";
import { useContext, useEffect } from "react";
import styled from "styled-components";
import { RootStoreContext } from "../../../stores/with-root-store";
import whitelist from "../../../assets/whitelistData/whitelistfinal.json";
import { generateMerkleTree } from "../../../util/minting/mintUtils";
import Button from "../ui/Button";

export type MintState = "whitelist" | "open" | "closed" | "sold out";

const AdminModule = observer(() => {
    const {
        adventurersContractStore: contractStore,
        adventurersContractStore: { totalSupply, supplyRemaining, mintPrice },
    } = useContext(RootStoreContext);

    useEffect(() => {
        if (!contractStore.contractLoaded) {
            contractStore.loadContractData();
        }
    }, []);

    const updateMerkleTree = () => {
        // const merkleTree = generateMerkleTree(whitelist);
        // const signer = web3Store.injectedProvider.getSigner();
        // contractStore.contract.connect(signer).setRoot(merkleTree.getHexRoot());
    };

    const toggleWhitelist = () => {
        // const signer = web3Store.injectedProvider.getSigner();
        // contractStore.contract.connect(signer).toggleWhitelist();
    };

    const toggleSale = () => {
        // const signer = web3Store.injectedProvider.getSigner();
        // contractStore.contract.connect(signer).toggleSale();
    };

    return (
        <MintModuleWrapper>
            <Button onClick={() => updateMerkleTree()}>Update whitelist</Button>
            <Button onClick={() => toggleWhitelist()}>Toggle whitelist</Button>
            <Button onClick={() => toggleSale()}>Toggle sale</Button>
        </MintModuleWrapper>
    );
});

const MintModuleWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 300px;
`;

const MintPurchaseHeader = styled.div``;

const MintSaleState = styled.div``;

const MintSupply = styled.div``;

const MintsRemainingModule = styled.div``;

export default AdminModule;
