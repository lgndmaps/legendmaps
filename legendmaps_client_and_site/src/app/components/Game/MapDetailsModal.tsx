import styled from "styled-components";
import { breakpoints, palette } from "../../../styles/styleUtils";
import { IMapMetaD } from "../../../types/metaMapTypes";
import Button from "../ui/Button";
import { useRouter } from "next/dist/client/router";
import Skull from "../../../assets/images/skull.png";
import { IMapD } from "../../../types/mapTypes";
import MapViewImage from "../MapViewer/MapViewImage";
import MapViewDetails from "../MapViewer/MapViewDetails";
export type MapViewDetailsModalProps = {
    mapInfo: IMapD;
    mapDetails: IMapMetaD;
    onSelect: () => void;
    onReturn: () => void;
};

const typeToString = {
    lineart: "Line Art",
    roomcount: "Rooms",
    wall: "Walls",
    biome: "Biome",
    glitch: "Glitch",
};

const MapDetailsWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 30px;

    flex-wrap: wrap;
    .image-container,
    .data.container {
        width: calc(50% - 20px);
        @media (max-width: ${breakpoints.tablet}) {
            width: 100%;
            margin-bottom: 20px;
        }
    }
`;

const MapViewDetailsModal = ({
    mapInfo: mapJson,
    mapDetails: mapMeta,
    onSelect,
    onReturn,
}: MapViewDetailsModalProps) => {
    const items = mapMeta.items.filter((item) => item.type !== "treasure");

    const treasure = mapMeta.items.filter((item) => item.type === "treasure");
    return (
        <MapDetailsWrapper>
            <div className="image-container">
                <MapViewImage mapJson={mapJson} mapMetaJson={mapMeta} />
            </div>
            <div className="data container">
                <MapViewDetails
                    mapInfo={mapJson}
                    mapDetails={mapMeta}
                    isMapSelect={true}
                    onSelect={onSelect}
                    onReturn={onReturn}
                />
            </div>
        </MapDetailsWrapper>
    );
};

export default MapViewDetailsModal;
