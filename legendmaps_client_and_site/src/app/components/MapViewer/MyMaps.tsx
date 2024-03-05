import { IMapD } from "../../../types/mapTypes";
import { MapsContainer } from "./maps.styles";
import MapThumbnail from "./MapThumbnail";

interface MyMapsProps {
    maps: IMapD[];
    isConnected: boolean;
}

const MyMaps = ({ maps, isConnected }: MyMapsProps) => {
    return (
        <div role="tabpanel">
            <div className="section-title">
                <h1>My Maps</h1>
            </div>
            {isConnected && (
                <MapsContainer>
                    <div className="map-list">
                        {maps.map((map) => (
                            <MapThumbnail map={map} isMine={true} />
                        ))}
                    </div>
                </MapsContainer>
            )}
            <div style={{ textAlign: "center" }}>
                {!isConnected
                    ? "Connect wallet or login to view your maps"
                    : maps.length === 0 && "You don't have any maps."}
            </div>
        </div>
    );
};

export default MyMaps;
