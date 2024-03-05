import React from "react";
import { ITab } from "../types/tabTypes";
import { LORE_TAB_KEYS, LORE_TAB_TITLES } from "../constants/loreConstants";
import World from "../app/components/Lore/World";
import { StyledPageContainer } from "../app/components/GlobalLayout/layout";
import Tabs from "../app/components/ui/TabNav";
import { DwellersCompendium } from "../app/components/Lore/DwellersCompendium";
import Title from "../app/components/ui/Title";

// Keeping this inscase we bring it back
// const loreTabs: ITab[] = [
//   {
//     key: LORE_TAB_KEYS.WORLD,
//     label: LORE_TAB_TITLES.WORLD,
//     component: <World title={LORE_TAB_TITLES.WORLD} />,
//   },
//   {
//     key: LORE_TAB_KEYS.DWELLERS_COMPENDIUM,
//     label: LORE_TAB_TITLES.DWELLERS_COMPENDIUM,
//     component: <DwellersCompendium title={LORE_TAB_TITLES.DWELLERS_COMPENDIUM} />,
//   },
// ];

const lore = () => {
    return (
        <StyledPageContainer>
            <Title text="lore" />
            {/* <Tabs tabs={loreTabs} /> */}
        </StyledPageContainer>
    );
};

export default lore;
