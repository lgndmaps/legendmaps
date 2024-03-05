import React from "react";
import {StyledPageContainer} from "../app/components/GlobalLayout/layout";
import Title from "../app/components/ui/Title";
import styled from "styled-components";

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

const roadmap = () => {
    return (
        <StyledPageContainer>
            <Title text=" Roadmap"/>
            <div
                style={{
                    padding: "0rem",
                    margin: "0rem",
                    display: "flex",
                    justifyContent: "center",
                }}
            >

            </div>
        </StyledPageContainer>
    );
};

const ImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 25px;
`;

export default roadmap;
