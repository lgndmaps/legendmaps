import styled from "styled-components";
import {observer} from "mobx-react-lite";
import dynamic from "next/dynamic";
import {useContext, useEffect, useState} from "react";
// import { fetchMultipleMetadata, getTokenUris } from "../../contracts/LegendMapsContract";
import {
    BIOME_OPTIONS,
    DWELLERS_OPTIONS,
    GLITCH_OPTIONS,
    ITEMS_OPTIONS,
    LINE_ART_OPTIONS,
    MATERIAL_OPTIONS,
    SEARCH_FIELDS,
    SPECIAL_ROOMS_OPTIONS,
    TRAPS_OPTIONS,
} from "../../constants/mapsConstants";
import {RootStoreContext} from "../../stores/with-root-store";
import useInfiniteMapsQuery from "../../app/hooks/useInfiniteMapsQuery";
import {StyledPageContainer} from "../../app/components/GlobalLayout/layout";
import Title from "../../app/components/ui/Title";
import Link from "next/link";

const DynamicMapTabs = dynamic(() => import("../../app/components/MapViewer/MapTabs"), {
    ssr: false,
});

const DynamicMyMaps = dynamic(() => import("../../app/components/MapViewer/MyMaps"), {
    ssr: false,
});

const DynamicAllMaps = dynamic(() => import("../../app/components/MapViewer/AllMaps"), {
    ssr: false,
});

export const MapsSelectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Index = observer((): JSX.Element => {
    const {mapsStore} = useContext(RootStoreContext);
    useContext(RootStoreContext);
    const {accountStore} = useContext(RootStoreContext);
    const {user, loadingAccount: isLoading} = accountStore;

    const [error, setError] = useState<string | null>(null);

    const {search, searchCategory, options, orderBy, orderDirection} = mapsStore.filter;

    const handleSearch = (e) => {
        setError(null);
        if (!e.target) {
            mapsStore.search(e.value);
        } else {
            // TODO add JOI for this and error messages
            let regex = /[^0-9a-zA-Z]+/gi;
            if (searchCategory === SEARCH_FIELDS.TOKEN_ID) {
                regex = /[^0-9" "]+/gi;
            }
            const value = e.target.value.replace(regex, "");
            mapsStore.search(value);
        }
    };
    const handleSearchCategory = ({value}) => {
        mapsStore.search("");
        mapsStore.searchCategory(value);
    };

    const handleOrderBy = ({value}) => {
        mapsStore.orderBy(value);
    };

    const {
        data,
        isLoading: isLoadingMaps,
        isFetchingNextPage,
        fetchNextPage,
    } = useInfiniteMapsQuery(search, searchCategory, {orderBy, order: orderDirection}, setError);

    const handleScroll = (e) => {
        checkScroll(e);
    };

    const handleOrderDirection = () => {
        mapsStore.orderDirection(orderDirection === "asc" ? "desc" : "asc");
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
        const {WALL_MATERIALS, BIOME, ITEMS, DWELLER, TRAPS, GLITCH, SPECIAL_ROOM, LINE_ART} = SEARCH_FIELDS;
        switch (searchCategory) {
            case WALL_MATERIALS:
                mapsStore.filterOptions(MATERIAL_OPTIONS);
                break;
            case BIOME:
                mapsStore.filterOptions(BIOME_OPTIONS);
                break;
            case ITEMS:
                mapsStore.filterOptions(ITEMS_OPTIONS);
                break;
            case DWELLER:
                mapsStore.filterOptions(DWELLERS_OPTIONS);
                break;
            case TRAPS:
                mapsStore.filterOptions(TRAPS_OPTIONS);
                break;
            case GLITCH:
                mapsStore.filterOptions(GLITCH_OPTIONS);
                break;
            case SPECIAL_ROOM:
                mapsStore.filterOptions(SPECIAL_ROOMS_OPTIONS);
                break;
            case LINE_ART:
                mapsStore.filterOptions(LINE_ART_OPTIONS);
                break;
            default:
                mapsStore.filterOptions(null);
                break;
        }
    }, [searchCategory]);

    return (
        <StyledPageContainer>
            <Title text="Maps"/>
            <p>Our first NFTs, the limited edition Founder Maps are the gateways to unique & unexplored dungeons. Each
                map is the keystone to a claim, establishing the dungeon's name, biome, and critically, the nasty
                creatures who dwell there and the loot an intrepid adventurer might find. You can view your currently
                owned Maps in your&nbsp;
                <Link href="/profile">Account Profile</Link>.</p>
            <br/>
            <DynamicAllMaps
                data={data}
                isLoading={isLoadingMaps}
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
            />
            {isFetchingNextPage && <div className="loading-message">Loading More Maps...</div>}
        </StyledPageContainer>
    );
});

export default Index;
