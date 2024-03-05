import React, { useContext } from "react";
import { StyledPageContainer } from "../app/components/GlobalLayout/layout";
import { RedeemPowerups } from "../app/components/Profile/RedeemPowerups";
import { UserRewards } from "../app/components/Profile/UserRewards";
import Title from "../app/components/ui/Title";
import { RootStoreContext } from "../stores/with-root-store";
import { observer } from "mobx-react-lite";
import { useContract, useSigner } from "wagmi";
import settings from "../settings";
import PowerUpContract from "../assets/contractABIs/LegendPowerUps.json";

const profile = observer(() => {
    const { accountStore } = useContext(RootStoreContext);
    const { gold } = accountStore.currencyBalances;

    return (
        <StyledPageContainer>
            {typeof gold !== "undefined" && <RedeemPowerups />}
            <UserRewards />
        </StyledPageContainer>
    );
});

export default profile;
