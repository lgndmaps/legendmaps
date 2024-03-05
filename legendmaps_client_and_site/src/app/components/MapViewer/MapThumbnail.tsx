import {useRouter} from "next/router";
import settings from "../../../settings";
import {IMapD} from "../../../types/mapTypes";
import {useSession} from "../../hooks/useSession";

export interface MapThumbnailProps {
    map: IMapD;
    isMine?: boolean;
}

const MapThumbnail = ({map, isMine = false}: MapThumbnailProps) => {
    const {setViewingMap, setViewingMyMaps} = useSession();
    const router = useRouter();
    return (
        <button
            className="map-thumbnail"
            onClick={() => {
                if (isMine) {
                    setViewingMyMaps(true);
                } else {
                    setViewingMyMaps(false);
                }
                setViewingMap(map.tokenId);

                router.push(`/maps/${map.tokenId}`);
            }}
        >
            <div className="map-thumbnail__image">
                <img src={`${settings.IMAGE_URL}${map.image.substring(7).split('/')[1]}`} alt={map.name}/>
            </div>
            <div className="map-thumbnail__name">
                #{map.tokenId} {map.name}
            </div>
        </button>
    );
};

export default MapThumbnail;
