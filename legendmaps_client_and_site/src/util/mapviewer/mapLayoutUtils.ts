import { HoverTileD, IMapD } from "../../types/mapTypes";
import mapConstants from "../../constants/mapsConstants";
import { IMapMetaD } from "../../types/metaMapTypes";

export const buildMapLayouts = (mapData: IMapD, mapMetaJson: IMapMetaD): HoverTileD[] => {
    const output: HoverTileD[] = [];

    const lineart = mapMetaJson?.globals?.find((elem) => elem.type === "lineart");
    if (lineart) {
        output.push({
            name: lineart.description,
            description: lineart.description,
            type: "lineart",
            rarity: lineart.rarityString,
            countPerMap: lineart.countPerMap,
            rarityScore: lineart.rarityScore,
            size: 9,
            offset: {
                x: 0,
                y: (16 / 25) * 100,
            },
        });
    }
    for (let i = 0; i < mapMetaJson.map.length; i++) {
        if (mapMetaJson.map[i].length) {
            for (let j = 0; j < mapMetaJson.map[i].length; j++) {
                const tile = mapMetaJson.map[i][j];

                if (tile?.description) {
                    if (tile?.type === "dweller") {
                        output.push({
                            name: tile.name,
                            type: tile.type,
                            description: tile.description,
                            rarity: tile.rarityString,
                            rarityScore: tile.rarityScore,
                            countPerMap: tile.countPerMap,
                            size: 2,
                            offset: {
                                x: (j / 25) * 100,
                                y: (i / 25) * 100,
                            },
                        });
                    } else if (tile?.type) {
                        output.push({
                            name: tile.name,
                            type: tile.type,
                            description: tile.description,
                            rarity: tile.rarityString,
                            rarityScore: tile.rarityScore,
                            countPerMap: tile.countPerMap,
                            size: 1,
                            offset: {
                                x: (j / 25) * 100,
                                y: (i / 25) * 100,
                            },
                        });
                    } else {
                        output.push({
                            name: "",
                            type: "",
                            description: tile.description,
                            countPerMap: null,
                            rarity: null,
                            rarityScore: null,
                            size: 1,
                            offset: {
                                x: (j / 25) * 100,
                                y: (i / 25) * 100,
                            },
                        });
                    }
                }
            }
        }
    }
    return output;
};
