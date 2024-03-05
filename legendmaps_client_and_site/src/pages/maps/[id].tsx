import MapViewComponent from "../../app/components/MapViewer/MapViewComponent";
import {IMapD} from "../../types/mapTypes";
import {IMapMetaD} from "../../types/metaMapTypes";
import {getMapServerSide} from "../../util/api/ServerSideApi";

export interface IMapServerProps {
    mapId?: number;
    mapJson?: IMapD;
    mapMetaJson?: IMapMetaD;
    notFound?: boolean;
}

export default function Map({mapId, mapJson, notFound, mapMetaJson}: IMapServerProps): JSX.Element {
    console.log("CHECKING MAP ", mapId + " " + notFound)
    if (notFound) {
        return <>No map found for token ID {mapId}</>;
    }
    return <MapViewComponent mapId={mapId} mapJson={mapJson} mapMetaJson={mapMetaJson}/>;
}

export const getServerSideProps = async (ctx) => {
    const {id} = ctx.params;
    const parsedId = parseInt(id, 10);
    const serverProps = await getMapServerSide(id);
    return {props: {...serverProps, mapId: parsedId}};
};
