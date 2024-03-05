import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { debounce } from "lodash";
import { useInfiniteQuery, UseInfiniteQueryResult } from "react-query";
import { adventurerUrlSearchBuilder } from "../../util/urlBuilders";
import settings from "../../settings";
import { QUERIES } from "../../constants/Queries";
import { AdventurerQueryResponse, OrderByOptions, SearchableFields } from "../../types/adventurerTypes";

const getAdventurers = async (url, pageParam) => {
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

type Params = {
    orderBy: OrderByOptions;
    order: "asc" | "desc";
    brawn: string;
    agility: string;
    guile: string;
    spirit: string;
    total: string;
    onlyDescriptions: boolean;
    publicAddress?: string;
};

const useInfiniteAdventurersQuery = (
    search: string,
    category: SearchableFields,
    params: Params,
    setError: Dispatch<SetStateAction<string | null>>,
): UseInfiniteQueryResult<AdventurerQueryResponse> => {
    const [debouncedSearch, setDebouncedSearch] = useState<string>();
    const debouncedSearchHandler = useMemo(() => debounce(() => setDebouncedSearch(search), 300), [search]);

    useEffect(() => {
        debouncedSearchHandler();
        return () => {
            debouncedSearchHandler.cancel();
        };
    }, [search, debouncedSearchHandler]);

    const url = adventurerUrlSearchBuilder(`${settings.API_URL}/adventurers`, search, category, params);
    return useInfiniteQuery(
        [QUERIES.SEARCH_ADVENTURERS, debouncedSearch, { category, params }],
        ({ pageParam = 1 }) => getAdventurers(url, pageParam),
        {
            getNextPageParam: (lastPage: AdventurerQueryResponse) => {
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

export default useInfiniteAdventurersQuery;
