import { ORDER_BY_OPTIONS, searchByOptions, ADVENTURER_SEARCH_FIELDS } from "../../../../constants/adventurerConstants";
import {
    IAdventurerD,
    AdventurerQueryResponse,
    OrderByOptions,
    SearchableFields,
    SearchOptions,
} from "../../../../types/adventurerTypes";
import Select from "../../Select";
import AdventurerThumbnail from "../AdventurerThumbnail";
import { OptionProps } from "react-select";
import { ChangeEvent, Fragment, useContext, useState } from "react";
import styled from "styled-components";
import { InfiniteData } from "react-query";
import { AdventurersContainer } from "../../AdventurerViewer/adventurers.styles";
import Button from "../../ui/Button";
import { AnimatePresence, motion } from "framer-motion";
import { css } from "@emotion/react";
import { RootStoreContext } from "../../../../stores/with-root-store";
import { observer } from "mobx-react-lite";
import { Checkbox } from "../../ui/Checkbox";
import { breakpoints } from "../../../../styles/styleUtils";

interface AllAdventurersProps {
    data: InfiniteData<AdventurerQueryResponse>;
    handleBAGSSearch: (stat: string, value: string) => void;
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
    onViewDetails: (adventurer: IAdventurerD) => void;
}

const StyledLabel = styled.label`
    display: flex;
    flex-direction: column;
    .styled-label-title {
        font-weight: 700;
    }
`;

const AllAdventurers = observer(
    ({
        data,
        handleBAGSSearch,
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
        onViewDetails,
    }: AllAdventurersProps) => {
        const { adventurersStore, gameStore } = useContext(RootStoreContext);
        const { createCampaign } = gameStore;

        const handleSearchPlaceholder = () => {
            const label = searchByOptions.find((option) => option.value === searchCategory)?.label;
            return `Enter ${label}`;
        };
        const [advancedOpen, setAdvancedOpen] = useState<boolean>(false);

        const isBasicSearch = [ADVENTURER_SEARCH_FIELDS.NAME, ADVENTURER_SEARCH_FIELDS.TOKEN_ID].includes(
            searchCategory,
        );
        const order = ORDER_BY_OPTIONS.find((o) => o.value === orderBy);
        const searchBy = searchByOptions.find((option) => option.value === searchCategory);
        return (
            <AdventurersContainer>
                <div className="search-wrapper">
                    <div className="search-container">
                        <StyledLabel className="search-by">
                            <span className="styled-label-title">Search By</span>
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
                                <span className="styled-label-title">Search For</span>
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
                        <div
                            css={css`
                                margin-left: 15px;
                                @media (max-width: ${breakpoints.tablet}) {
                                    width: 100%;
                                    margin-top: 15px;
                                    margin-left: 0;
                                }
                            `}
                        >
                            <Checkbox
                                label={"Has Lore"}
                                checked={adventurersStore.filter.onlyDescriptions}
                                onClick={() => {
                                    adventurersStore.filter.onlyDescriptions =
                                        !adventurersStore.filter.onlyDescriptions;
                                }}
                            />
                        </div>
                        {error && <p className="error">{error}</p>}
                        <div className="attributes-section">
                            <div
                                className="attributes-section-title"
                                onClick={() => {
                                    setAdvancedOpen(!advancedOpen);
                                }}
                            >
                                <span
                                    css={css`
                                        color: #858585;
                                    `}
                                >
                                    {advancedOpen ? "-" : "+"}
                                </span>{" "}
                                Minimum Attributes
                            </div>
                            <AnimatePresence>
                                {advancedOpen && (
                                    <motion.div>
                                        <div className="attributes-filters">
                                            <div className="base-attributes">
                                                <div>
                                                    <input
                                                        className="number-search search"
                                                        placeholder={"0"}
                                                        onChange={(e) => {
                                                            const regex = /[^0-9" "]+/gi;
                                                            const value = e.target.value.replace(regex, "");
                                                            if (
                                                                (value.length <= 2 && parseInt(value) <= 18) ||
                                                                e.target.value === ""
                                                            ) {
                                                                handleBAGSSearch("brawn", value);
                                                            }
                                                        }}
                                                        value={adventurersStore.filter.bagsValues.brawn}
                                                    />
                                                    <span>Brawn</span>
                                                </div>
                                                <div>
                                                    <input
                                                        className="number-search search"
                                                        placeholder={"0"}
                                                        onChange={(e) => {
                                                            const regex = /[^0-9" "]+/gi;
                                                            const value = e.target.value.replace(regex, "");
                                                            if (
                                                                (value.length <= 2 && parseInt(value) <= 18) ||
                                                                e.target.value === ""
                                                            ) {
                                                                handleBAGSSearch("guile", value);
                                                            }
                                                        }}
                                                        value={adventurersStore.filter.bagsValues.guile}
                                                    />
                                                    <span>Guile</span>
                                                </div>
                                                <div>
                                                    <input
                                                        className="number-search search"
                                                        placeholder={"0"}
                                                        onChange={(e) => {
                                                            const regex = /[^0-9" "]+/gi;
                                                            const value = e.target.value.replace(regex, "");
                                                            if (
                                                                (value.length <= 2 && parseInt(value) <= 18) ||
                                                                e.target.value === ""
                                                            ) {
                                                                handleBAGSSearch("agility", value);
                                                            }
                                                        }}
                                                        value={adventurersStore.filter.bagsValues.agility}
                                                    />
                                                    <span>Agility</span>
                                                </div>
                                                <div>
                                                    <input
                                                        className="number-search search"
                                                        placeholder={"0"}
                                                        onChange={(e) => {
                                                            const regex = /[^0-9" "]+/gi;
                                                            const value = e.target.value.replace(regex, "");
                                                            if (
                                                                (value.length <= 2 && parseInt(value) <= 18) ||
                                                                e.target.value === ""
                                                            ) {
                                                                handleBAGSSearch("spirit", value);
                                                            }
                                                        }}
                                                        value={adventurersStore.filter.bagsValues.spirit}
                                                    />
                                                    <span>Spirit</span>
                                                </div>
                                            </div>
                                            <div className="total-attr">
                                                <div>
                                                    <input
                                                        className="number-search search"
                                                        placeholder={"0"}
                                                        onChange={(e) => {
                                                            e.preventDefault();
                                                            const regex = /[^0-9" "]+/gi;
                                                            const value = e.target.value.replace(regex, "");
                                                            if (
                                                                (value.length <= 2 && parseInt(value) <= 99) ||
                                                                e.target.value === ""
                                                            ) {
                                                                handleBAGSSearch("total", value);
                                                            }
                                                        }}
                                                        value={adventurersStore.filter.bagsValues.total}
                                                    />
                                                    <span>BAGS Total</span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                    <div className="sort-row">
                        <div
                            css={css`
                                font-weight: 700;
                            `}
                        >
                            Total Results: {data?.pages[0]?.count}
                        </div>
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
                <div className="adventurer-list">
                    {isLoading ? (
                        <div className="adventurer-state">Loading...</div>
                    ) : !data?.pages[0]?.rows?.length ? (
                        // TODO Styled this better
                        <div className="adventurer-state">No adventurers found</div>
                    ) : (
                        data?.pages.map((page) => {
                            return (
                                <Fragment key={page.page}>
                                    {page.rows.map((adventurer) => (
                                        <AdventurerThumbnail
                                            onClick={(adventurerId: number) => {
                                                createCampaign(adventurerId, gameStore.selectedPowerup);
                                            }}
                                            adventurer={adventurer}
                                            key={adventurer.tokenId}
                                            onViewDetails={(adventurer: IAdventurerD) => onViewDetails(adventurer)}
                                        />
                                    ))}
                                </Fragment>
                            );
                        })
                    )}
                </div>
            </AdventurersContainer>
        );
    },
);

export default AllAdventurers;
