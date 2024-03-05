import settings from "../../settings";
import {IMapD} from "../../types/mapTypes";
import {IMapMetaD} from "../../types/metaMapTypes";
import {getSession} from "../auth";

export const getUserServerSide = async () => {
    return await getSession();
};

export const getMapServerSide = async (id: number) => {
    if (id) {
        try {
            const map = await fetch(`${settings.API_URL}/maps/${id}`);
            if (map.status === 404) {
                return {
                    notFound: true,
                };
            }
            const apiMap = await map.json();

            const mapJson: IMapD = apiMap;
            const mapMetaJson: IMapMetaD = JSON.parse(mapJson.details);
            return {
                mapJson,
                mapMetaJson,
            };
        } catch (e) {
            console.log("ERROR", e);
            return {

                notFound: true,
            };
        }
    }
};

export const getAdventurerServerSide = async (id: number) => {
    if (id) {
        try {
            const adventurer = await fetch(`${settings.API_URL}/adventurers/${id}`);
            if (adventurer.status === 404) {
                return {
                    notFound: true,
                };
            }
            const adventurerData = await adventurer.json();
            return {
                adventurerData,
            };
        } catch {
            return {
                notFound: true,
            };
        }
    }
};
