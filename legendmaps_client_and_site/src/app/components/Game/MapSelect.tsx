import {observer} from "mobx-react-lite";
import {useEffect, useState} from "react";
import styled from "styled-components";
import {useRootStore} from "../../../store";
import MapThumbnail from "./MapThumbnail";
import {css} from "@emotion/react";
import {TitleBanner} from "../ui/TitleBanner";
import {IMapD} from "../../../types/mapTypes";
import {AnimatePresence, motion} from "framer-motion";
import MapViewDetailsModal from "./MapDetailsModal";
import {niceScrollbars} from "../../../styles/styleUtils";

export const MapSelect = observer(() => {
    const {
        accountStore: {
            user,
            featureFlags: {devMode},
        },
        gameStore: {getAvailableMaps, selectableMaps, selectMapForSession},
    } = useRootStore();

    const [viewingMapDetails, setViewingMapDetails] = useState<IMapD | undefined>();

    useEffect(() => {
        getAvailableMaps();
    }, []);


    const mapMeta = selectableMaps.find((map) => map.mapData.tokenId === viewingMapDetails?.tokenId);

    return (
        <>
            <TitleBanner title={"Choose a Map"}/>
            <AnimatePresence>
                {viewingMapDetails && mapMeta && (
                    <motion.div
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        css={css`
                          position: fixed;
                          width: 100vw;
                          height: 100vh;
                          left: 0;
                          top: 0;
                          background: #000;
                          z-index: 1000000;
                          overflow-x: auto;
                          ${niceScrollbars};
                        `}
                    >

                        <MapViewDetailsModal
                            mapInfo={mapMeta.mapData}
                            mapDetails={mapMeta.mapMeta}
                            onSelect={() => {
                                selectMapForSession(viewingMapDetails);
                            }}
                            onReturn={() => {
                                setViewingMapDetails(undefined);
                            }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
            <MapsWrapper>
                {selectableMaps.map((map) => (
                    <>
                        <MapThumbnail
                            map={map.mapData}
                            mapMeta={map.mapMeta}
                            onViewDetails={(map: IMapD) => {
                                setViewingMapDetails(map);
                            }}
                            onSelect={(map) => selectMapForSession(map)}
                        />
                    </>
                ))}
            </MapsWrapper>
        </>
    );
});

const MapsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 40px;
`;
