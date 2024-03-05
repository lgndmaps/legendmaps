import { IMapD } from "../../../types/mapTypes";
import MapViewImage from "./MapViewImage";
import styled from "styled-components";
import { IMapMetaD } from "../../../types/metaMapTypes";
import MapViewDetails from "./MapViewDetails";
import { breakpoints, palette } from "../../../styles/styleUtils";
import { useRouter } from "next/dist/client/router";

export interface MapViewProps {
    mapId: number;
    mapJson: IMapD;
    mapMetaJson: IMapMetaD;
}

const MapViewWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 0 40px;
    @media (max-width: ${breakpoints.tablet}) {
        padding: 0 10px;
    }
    flex-wrap: wrap;
    .image-container,
    .data.container {
        width: calc(50% - 20px);
        @media (max-width: ${breakpoints.tablet}) {
            width: 100%;
            margin-bottom: 20px;
        }
    }

    .back-to-maps {
        width: 100%;
        margin-bottom: 15px;
        cursor: pointer;
        color: ${palette.primary.gray};
    }
`;

const MapViewComponent = ({ mapId, mapJson, mapMetaJson }: MapViewProps) => {
    const router = useRouter();
    return (
        <MapViewWrapper>
            <div onClick={() => router.push("/maps")} className="back-to-maps">
                {"< Back to Maps"}
            </div>
            <div className="image-container">
                <MapViewImage mapJson={mapJson} mapMetaJson={mapMetaJson} />
            </div>
            <div className="data container">
                <MapViewDetails mapInfo={mapJson} mapDetails={mapMetaJson} />
            </div>
        </MapViewWrapper>
    );
};

export default MapViewComponent;
