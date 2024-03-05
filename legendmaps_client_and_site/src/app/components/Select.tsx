import { ChangeEvent } from "react";
import Select, { OptionProps } from "react-select";
import styled, { css } from "styled-components";
import { palette } from "../../styles/styleUtils";
import { searchBreakpoint } from "./MapViewer/maps.styles";

const StyledSelect = styled(Select)<{ $width?: number }>`
    background-color: ${palette.primary.black};
    min-width: ${({ $width }) => $width || 310}px;
    @media (max-width: ${searchBreakpoint}) {
        min-width: 200px;
    }

    .react-select {
        &__control {
            max-height: 36px;
            color: ${palette.secondary.white};
            background-color: ${palette.primary.black} !important;
            display: flex;

            border: 1px solid ${palette.secondary.white};
            border-radius: 0;
            &--is-focused {
                box-shadow: none;
                &:hover {
                    border-color: ${palette.secondary.white};
                }
            }
        }
        &__value-container {
            padding: 0 8px;
            margin: 1px 0 2px 0;
        }
        &__menu-list {
            border: 1px solid ${palette.secondary.white};
        }
        &__indicator-separator {
            display: none;
        }
        &__menu {
            background-color: ${palette.primary.black};
        }
        &__single-value {
            color: white;
        }
        &__option {
            color: ${palette.secondary.textGray};
            &--is-focused {
                color: ${palette.secondary.white};
                background-color: ${palette.primary.black};
            }
            &--is-selected {
                background-color: ${palette.secondary.white};
                color: ${palette.primary.black};
            }
            &:active {
                background-color: ${palette.secondary.white};
                color: ${palette.primary.black};
            }
        }
    }
`;

interface IProps {
    placeholder: string;
    options: { value: string; label: string }[];
    isSearchable?: boolean;
    defaultValue?: { value: string; label: string };
    width?: number;
    onChange: (event: ChangeEvent<HTMLInputElement> | OptionProps) => void;
}

const MapsSearch = ({ placeholder, options, isSearchable = true, width, defaultValue, onChange }: IProps) => {
    // const hideOptions = label === "Name" || label === "Token ID";
    return (
        <StyledSelect
            className="select search"
            classNamePrefix="react-select"
            // menuIsOpen={true}
            placeholder={placeholder}
            options={options}
            theme={null}
            onChange={onChange}
            isSearchable={isSearchable}
            defaultValue={defaultValue}
            $width={width}
        />
    );
};

export default MapsSearch;
