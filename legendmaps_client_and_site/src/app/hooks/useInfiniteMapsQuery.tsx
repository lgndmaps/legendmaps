import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { debounce } from "lodash";
import { useInfiniteQuery, UseInfiniteQueryResult } from "react-query";
import { urlSearchBuilder } from "../../util/urlBuilders";
import settings from "../../settings";
import { QUERIES } from "../../constants/Queries";
import { MapQueryResponse, OrderByOptions, SearchableFields } from "../../types/mapTypes";

const getMaps = async (url, pageParam) => {
    return new Promise((resolve, reject) => {
        return fetch(`${url}&page=${pageParam}`, {
            method: "get",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        }).then(async (res) => {
            const response = await res.json();
            if (res.status === 200) {
                resolve(response);
            }
            if (res.status >= 400) {
                if (response?.errors?.session) {
                    reject(new Error(response.errors.session));
                } else {
                    if (res.status === 422) {
                        reject("Invalid search parameters");
                    }
                    reject(new Error("Sorry, something went wrong"));
                }
            } else {
                reject(new Error("Sorry, something went wrong"));
            }
        });
    });
};

interface QueryProps {
    search: string;
    category: SearchableFields;
    params: { orderBy; order: "asc" | "desc" };
}

type Params = { orderBy: OrderByOptions; order: "asc" | "desc" };

const useInfiniteMapsQuery = (
    search: string,
    category: SearchableFields,
    params: Params,
    setError: Dispatch<SetStateAction<string | null>>,
): UseInfiniteQueryResult<MapQueryResponse> => {
    const [debouncedSearch, setDebouncedSearch] = useState<string>();
    const debouncedSearchHandler = useMemo(() => debounce(() => setDebouncedSearch(search), 300), [search]);

    useEffect(() => {
        debouncedSearchHandler();
        return () => {
            debouncedSearchHandler.cancel();
        };
    }, [search, debouncedSearchHandler]);
    const url = urlSearchBuilder(`${settings.API_URL}/maps`, search, category, params);
    return useInfiniteQuery(
        [QUERIES.SEARCH_MAPS, debouncedSearch, { category, params }],
        ({ pageParam = 1 }) => getMaps(url, pageParam),
        {
            getNextPageParam: (lastPage: MapQueryResponse) => {
                const { page, hasNextPage } = lastPage;
                return hasNextPage ? +page + 1 : undefined;
            },
            onError: (err: string) => {
                setError(err);
            },
            staleTime: 60 * 60 * 1000,
            cacheTime: 60 * 60 * 1000,
        },
    );
};

export default useInfiniteMapsQuery;
