import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { RootStoreContext } from "../../../stores/with-root-store";
import { AdventurersContainer } from "../AdventurerViewer/adventurers.styles";
import AdventurerThumbnail from "./AdventurerThumbnail";
import Title from "../ui/Title";
import { MyAdventurerInfiniteScroll } from "./AdventurerInfiniteScroll/AdventurerInfiniteScroll";
import { IAdventurerD } from "../../../types/adventurerTypes";
import { AnimatePresence, motion } from "framer-motion";
import { niceScrollbars } from "../../../styles/styleUtils";
import AdventurerDetailsModal from "./AdventurerDetailsModal";
import { css } from "@emotion/react";
import { TitleBanner } from "../ui/TitleBanner";
import { PowerupSelect } from "./PowerupSelect";

export const AdventurerSelect = () => {
    const [viewingAdventurerDetails, setViewingAdventurerDetails] = useState<IAdventurerD | undefined>();
    const { adventurersStore, gameStore } = useContext(RootStoreContext);
    const { createCampaign } = gameStore;
    return (
        <div>
            <TitleBanner title={"Choose an Adventurer"} />
            <PowerupSelect />
            <AnimatePresence>
                {viewingAdventurerDetails && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        css={css`
                            position: fixed;
                            width: 100vw;
                            height: 100vh;
                            top: 0;
                            left: 0;
                            background: #000;
                            z-index: 1000000;
                            overflow-x: auto;
                            ${niceScrollbars};
                        `}
                    >
                        <AdventurerDetailsModal
                            adventurer={viewingAdventurerDetails}
                            onSelect={() => {
                                createCampaign(viewingAdventurerDetails.tokenId, gameStore.selectedPowerup);
                            }}
                            onReturn={() => {
                                setViewingAdventurerDetails(undefined);
                            }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
            <AdventurersContainer>
                <MyAdventurerInfiniteScroll onViewDetails={(adventurer) => setViewingAdventurerDetails(adventurer)} />
            </AdventurersContainer>
        </div>
    );
};

const AdventurerSelectWrapper = styled.div``;
