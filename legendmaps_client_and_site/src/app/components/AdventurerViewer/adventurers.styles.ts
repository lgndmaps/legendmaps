import styled from "styled-components";
import { breakpoints, palette } from "../../../styles/styleUtils";

export const searchBreakpoint = "650px";

export const AdventurersContainer = styled.div`
margin-top: 20px;
  .search-wrapper {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    padding: 0 20px;
  }
  .adventurer-list {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
  }

  input.number-search {
    width: 40px !important;
    height: 40px !important;
    padding: 4px 10px;
    text-align: center;
    &:focus-visible {
      outline: 2px solid ${palette.secondary.white};
    }
  }

  .attributes-filters{
    display: flex;
    flex-wrap: wrap;
  }

  .total-attr,
  .base-attributes{
    width: 350px;
    display: flex;
    flex-wrap: wrap;
    & > div{
      width: 50%;
      margin: 5px 0;
      @media (max-width: ${searchBreakpoint}) {
        width: 100%;
      }
    }
    span{
      margin-left: 15px;
    }
  }

  .number-search{
    padding: 4px !important;
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

  .attributes-section{
    width: 100%;
    margin-top: 15px;

    &-title{
      cursor: pointer;
      font-weight: 700;
    }
  }



  .sort-row {
    display: flex;
    justify-content: space-between;
    margin: 10px 0;
    margin-top: 15px;
    align-items: flex-start;
    padding-top: 15px;
    border-top: 1px dashed #707070;
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
  .adventurer-thumbnail {
    text-decoration: none !important;
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
      .adventurer-thumbnail__image {
        border-color: #fff;
      }
      .adventurer-thumbnail__name {
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
  .adventurer-state {
    margin: 20px;
  }
  .serach-
`;
