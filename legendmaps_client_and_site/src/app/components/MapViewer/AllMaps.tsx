import { ORDER_BY_OPTIONS, searchByOptions, SEARCH_FIELDS } from "../../../constants/mapsConstants";
import { IMapD, MapQueryResponse, OrderByOptions, SearchableFields, SearchOptions } from "../../../types/mapTypes";
import Select from "../Select";
import MapThumbnail from "./MapThumbnail";
import { OptionProps } from "react-select";
import { ChangeEvent, Fragment } from "react";
import styled from "styled-components";
import { InfiniteData } from "react-query";
import { MapsContainer } from "./maps.styles";
import Button from "../ui/Button";
import { motion } from "framer-motion";
interface MyMapsProps {
    data: InfiniteData<MapQueryResponse>;
    handleSearch: (event: ChangeEvent<HTMLInputElement> | OptionProps) => void;
    handleSearchCategory: (OptionProps) => void;
    handleOrderBy: (OptionProps) => void;
    handleOrderDirection: () => void;
    orderDirection: "asc" | "desc";
    search: string;
    orderBy: OrderByOptions;
    searchCategory: SearchableFields;
    isLoading: boolean;
    options: SearchOptions;
    error: string | null;
}

const StyledLabel = styled.label`
    display: flex;
    flex-direction: column;
`;

const AllMaps = ({
    data,
    handleSearch,
    handleSearchCategory,
    handleOrderBy,
    handleOrderDirection,
    search,
    searchCategory,
    orderBy,
    isLoading,
    options,
    orderDirection,
    error,
}: MyMapsProps) => {
    const handleSearchPlaceholder = () => {
        const label = searchByOptions.find((option) => option.value === searchCategory)?.label;
        return `Enter ${label}`;
    };

    const isBasicSearch = [SEARCH_FIELDS.NAME, SEARCH_FIELDS.TOKEN_ID].includes(searchCategory);
    const order = ORDER_BY_OPTIONS.find((o) => o.value === orderBy);
    const searchBy = searchByOptions.find((option) => option.value === searchCategory);
    return (
        <MapsContainer>
            <div className="search-wrapper">
                <div className="search-container">
                    <StyledLabel className="search-by">
                        Search By
                        <Select
                            placeholder={""}
                            options={searchByOptions}
                            isSearchable={false}
                            onChange={handleSearchCategory}
                            defaultValue={searchBy}
                            width={190}
                        />
                    </StyledLabel>
                    {isBasicSearch ? (
                        <StyledLabel className="search-for">
                            Search For
                            <input
                                className="search"
                                placeholder={handleSearchPlaceholder()}
                                onChange={handleSearch}
                                value={search}
                            />
                        </StyledLabel>
                    ) : (
                        <StyledLabel className="search-for">
                            Search For
                            <Select
                                key={handleSearchPlaceholder()}
                                placeholder={handleSearchPlaceholder()}
                                options={options}
                                isSearchable={true}
                                onChange={handleSearch}
                            />
                        </StyledLabel>
                    )}
                    {error && <p className="error">{error}</p>}
                </div>
                <div className="sort-row">
                    <div>Total Results: {data?.pages[0]?.count}</div>
                    <div className="sort-container">
                        <Button className="order" onClick={handleOrderDirection}>
                            {orderDirection}{" "}
                            <motion.div
                                animate={{ rotate: orderDirection === "asc" ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                                className={`arrow ${orderDirection}`}
                            >
                                &uarr;
                            </motion.div>
                        </Button>
                        <StyledLabel className="search-for">
                            Sort By
                            <Select
                                placeholder={""}
                                options={ORDER_BY_OPTIONS}
                                isSearchable={false}
                                onChange={handleOrderBy}
                                defaultValue={order}
                                width={265}
                            />
                        </StyledLabel>
                    </div>
                </div>
            </div>
            <div className="map-list">
                {isLoading ? (
                    <div className="map-state">Loading...</div>
                ) : !data?.pages[0]?.rows?.length ? (
                    // TODO Styled this better
                    <div className="map-state">No maps found</div>
                ) : (
                    data?.pages.map((page) => {
                        return (
                            <Fragment key={page.page}>
                                {page.rows.map((map) => (
                                    <MapThumbnail map={map} key={map.tokenId} />
                                ))}
                            </Fragment>
                        );
                    })
                )}
            </div>
        </MapsContainer>
    );
};

export default AllMaps;
