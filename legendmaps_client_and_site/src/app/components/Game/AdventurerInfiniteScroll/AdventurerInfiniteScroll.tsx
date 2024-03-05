import styled from "styled-components";
import { observer } from "mobx-react-lite";
import dynamic from "next/dynamic";
import { debounce } from "lodash";
import { useEffect, useState, useMemo, useContext } from "react";
import {
    ORDER_BY,
    ORDER_BY_OPTIONS,
    searchByOptions,
    ADVENTURER_SEARCH_FIELDS,
    TRAIT_OPTIONS,
    art,
    GLITCH_OPTIONS,
} from "../../../../constants/adventurerConstants";
import { useSession } from "../../../../app/hooks/useSession";
import { RootStoreContext } from "../../../../stores/with-root-store";
import { StyledPageContainer } from "../../../../app/components/GlobalLayout/layout";
import Title from "../../../../app/components/ui/Title";
import useInfiniteAdventurersQuery from "../../../../app/hooks/useInfiniteAdventurersQuery";
import { string } from "mobx-state-tree/dist/internal";
import { IAdventurerD } from "../../../../types/adventurerTypes";

const DynamicAllAdventurers = dynamic(() => import("./AllAdventurers"), {
    ssr: false,
});

export const AdventurersSelectionWrapper = styled.div`
    display: flex;
    flex-direction: column;
`;

export type MyAdventurerInfiniteScrollProps = {
    onClick?: (id: number) => void;
    onViewDetails: (adventurer: IAdventurerD) => void;
};

export const MyAdventurerInfiniteScroll = observer(
    ({ onViewDetails }: MyAdventurerInfiniteScrollProps): JSX.Element => {
        const { adventurersStore } = useContext(RootStoreContext);
        useContext(RootStoreContext);
        const { accountStore } = useContext(RootStoreContext);
        const { user, loadingAccount: isLoading } = accountStore;

        const [error, setError] = useState<string | null>(null);

        const {
            search,
            searchCategory,
            options,
            orderBy,
            orderDirection,
            onlyDescriptions,
            bagsValues: { brawn, agility, guile, spirit, total },
        } = adventurersStore?.filter || {
            search: "",
            searchCategory: searchByOptions[0].value,
            options: [],
            orderBy: ORDER_BY.TOKEN_ID,
            orderDirection: "asc",
            onlyDescriptions: false,
            bagsValues: {
                brawn: "",
                agility: "",
                guile: "",
                spirit: "",
                total: "",
            },
        };

        const handleSearch = (e) => {
            setError(null);
            if (!e.target) {
                adventurersStore.search(e.value);
            } else {
                // TODO add JOI for this and error messages
                let regex = /[^0-9a-zA-Z]+/gi;
                if (searchCategory === ADVENTURER_SEARCH_FIELDS.TOKEN_ID) {
                    regex = /[^0-9" "]+/gi;
                }
                const value = e.target.value.replace(regex, "");
                adventurersStore.search(value);
            }
        };
        const handleSearchCategory = ({ value }) => {
            adventurersStore.search("");
            adventurersStore.searchCategory(value);
        };

        const handleBAGSSearch = (stat: "brawn" | "agility" | "guile" | "spirit" | "total", value: string) => {
            adventurersStore.filter.bagsValues[stat] = value;
        };

        const handleOrderBy = ({ value }) => {
            adventurersStore.orderBy(value);
        };

        const {
            data,
            isLoading: isLoadingAdventurers,
            isFetchingNextPage,
            fetchNextPage,
        } = useInfiniteAdventurersQuery(
            search,
            searchCategory,
            {
                orderBy,
                order: orderDirection,
                brawn,
                agility,
                guile,
                spirit,
                total,
                onlyDescriptions,
                publicAddress: accountStore?.user?.publicAddress,
            },
            setError,
        );

        const handleScroll = (e) => {
            checkScroll(e);
        };

        const handleOrderDirection = () => {
            adventurersStore.orderDirection(orderDirection === "asc" ? "desc" : "asc");
        };

        const checkScroll = async (e) => {
            const isFetchPoint =
                e.target.documentElement.scrollHeight - e.target.documentElement.scrollTop <=
                e.target.documentElement.clientHeight + 20;
            if (isFetchPoint && !isFetchingNextPage) {
                await fetchNextPage();
            }
        };

        useEffect(() => {
            if (typeof window !== "undefined") {
                window.addEventListener("scroll", handleScroll);
                return () => window.removeEventListener("scroll", handleScroll);
            }
        }, [data]);

        useEffect(() => {
            const { NAME, GLITCH, ART, TRAIT } = ADVENTURER_SEARCH_FIELDS;
            switch (searchCategory) {
                case NAME:
                    adventurersStore.filterOptions(TRAIT_OPTIONS);
                    break;
                case ART:
                    adventurersStore.filterOptions(
                        art
                            .map((a) => {
                                return { value: a.name, label: a.name };
                            })
                            .sort(function (a, b) {
                                const textA = a.label.toUpperCase();
                                const textB = b.label.toUpperCase();
                                return textA < textB ? -1 : textA > textB ? 1 : 0;
                            }),
                    );
                    break;
                case GLITCH:
                    adventurersStore.filterOptions(GLITCH_OPTIONS);
                    break;
                case TRAIT:
                    adventurersStore.filterOptions(
                        TRAIT_OPTIONS.sort(function (a, b) {
                            const textA = a.label.toUpperCase();
                            const textB = b.label.toUpperCase();
                            return textA < textB ? -1 : textA > textB ? 1 : 0;
                        }),
                    );
                    break;
                default:
                    adventurersStore.filterOptions(null);
                    break;
            }
        }, [searchCategory]);

        return (
            <StyledPageContainer>
                <DynamicAllAdventurers
                    data={data}
                    isLoading={isLoadingAdventurers}
                    handleBAGSSearch={handleBAGSSearch}
                    handleSearch={handleSearch}
                    handleSearchCategory={handleSearchCategory}
                    handleOrderBy={handleOrderBy}
                    handleOrderDirection={handleOrderDirection}
                    orderBy={orderBy}
                    orderDirection={orderDirection}
                    searchCategory={searchCategory}
                    search={search}
                    options={options}
                    error={error}
                    onViewDetails={onViewDetails}
                />
                {isFetchingNextPage && <div className="loading-message">Loading More Adventurers...</div>}
            </StyledPageContainer>
        );
    },
);
