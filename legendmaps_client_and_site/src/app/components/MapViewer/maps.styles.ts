import styled from "styled-components";
import { breakpoints, palette } from "../../../styles/styleUtils";

export const searchBreakpoint = "650px";

export const MapsContainer = styled.div`
    .search-wrapper {
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        padding: 0 20px;
    }
    .map-list {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
    }
    .search-container {
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        flex-direction: row;
        align-items: flex-end;
        input.search {
            width: 310px;
            padding: 4px 10px;

            &:focus-visible {
                outline: 2px solid ${palette.secondary.white};
            }
        }
        .select {
            margin: 1px 11px 0 0;
            border-radius: 0;
        }
        .error {
            color: ${palette.secondary.error};
        }
        @media (max-width: ${searchBreakpoint}) {
            label {
                margin: 8px 0;
            }
        }
    }

    .sort-row {
        display: flex;
        justify-content: space-between;
        margin: 10px 0;
        align-items: flex-end;
        flex-wrap: wrap;
        @media (max-width: ${searchBreakpoint}) {
            /* flex-direction: row-reverse; */
            flex-wrap: wrap-reverse;
            align-items: flex-start;
        }
    }
    .sort-container {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        button.order {
            display: flex;
            margin: 0 10px 0 0;
            height: 38px;
            padding: 0 10px;
            min-width: 5rem;
            border: 0px;
            .label {
                display: flex;
                justify-content: space-between;
            }
            div.arrow {
                margin-left: 5px;
                font-size: 1.9rem;
            }
        }
        @media (max-width: ${searchBreakpoint}) {
            flex-direction: row-reverse;
            margin-bottom: 16px;
        }
    }
    .map-thumbnail {
        width: calc(33.33333% - 40px);
        margin: 20px;
        cursor: pointer;
        @media (max-width: ${breakpoints.tablet}) {
            width: calc(50% - 40px);
        }
        @media (max-width: ${breakpoints.mobile}) {
            width: 100%;
        }
        &:hover {
            background: none !important;
            .map-thumbnail__image {
                border-color: #fff;
            }
            .map-thumbnail__name {
                color: #fff;
            }
        }
        &__image {
            border: 1px solid ${palette.primary.gray};
            position: relative;
            padding-bottom: 100%;
            img {
                display: block;
                margin-bottom: 0;
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: auto;
            }
        }
        &__name {
            margin-top: 10px;
            color: ${palette.primary.gray};
            text-align: left;
        }
    }

    .loading-message {
        width: 100%;
        margin: 30px;
        text-align: center;
    }
    .search-wrapper {
        width: 100%;
        label {
            display: flex;
            flex-direction: column;
        }
    }
    .map-state {
        margin: 20px;
    }
`;
