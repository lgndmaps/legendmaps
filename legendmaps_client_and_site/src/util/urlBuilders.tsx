import { SEARCH_FIELDS } from "../constants/mapsConstants";
import { ADVENTURER_SEARCH_FIELDS, art } from "../constants/adventurerConstants";
export const urlSearchBuilder = (url: string, search, category, params: any) => {
    const queryString = Object.keys(params)
        .map((key) => {
            return encodeURIComponent(key) + "=" + encodeURIComponent(params[key]);
        })
        .join("&");
    if (search || params) {
        if (category === SEARCH_FIELDS.TOKEN_ID) {
            // Remove excess white space and replace spaces with , for token id search
            search = search?.trim().replace(/[ ,]+/g, ",");
        }
        return `${url}?${search ? `search${category ? `[${category}]` : ""}=${search}` : ""}${
            queryString ? `&${queryString}` : ""
        }`;
    }
    return `${url}?`;
};

export const adventurerUrlSearchBuilder = (url: string, search, category, params: any) => {
    const queryString = Object.keys(params)
        .map((key) => {
            console.log(params[key]);
            if (params[key] !== "") {
                return encodeURIComponent(key) + "=" + encodeURIComponent(params[key]);
            }
        })
        .filter((s) => {
            return s !== undefined;
        })
        .join("&");
    if (search || params) {
        let cat = category;
        if (category === ADVENTURER_SEARCH_FIELDS.TOKEN_ID) {
            // Remove excess white space and replace spaces with , for token id search
            search = search?.trim().replace(/[ ,]+/g, ",");
        } else if (category === ADVENTURER_SEARCH_FIELDS.ART) {
            const artItem = art.find((a) => a.name === search);
            if (artItem) {
                cat = artItem.type;
            }
        } else if (category === ADVENTURER_SEARCH_FIELDS.GLITCH) {
            cat = "traits";
        } else if (category === ADVENTURER_SEARCH_FIELDS.TRAIT) {
            cat = "traits";
        }
        return `${url}?${search ? `search${cat ? `[${cat}]` : ""}=${search}` : ""}${
            queryString ? `&${queryString}` : ""
        }`;
    }
    return `${url}?`;
};
