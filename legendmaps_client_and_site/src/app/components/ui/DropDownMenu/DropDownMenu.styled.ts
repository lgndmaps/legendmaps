import styled from "styled-components";
import { motion } from "framer-motion";
import { breakpoints, palette } from "../../../../styles/styleUtils";

export const StyledMenuContainer = styled(motion.div)<{ $leftOffset?: number; $rightOffset?: number }>`
    position: relative;
    .title {
        @media (min-width: ${breakpoints.tablet}) {
            padding: 8px 7px 8px 7px;
        }
        transition: border 0.2s ease-in-out;
        border: 1px solid ${palette.primary.black};
        cursor: pointer;
        margin: 0;
        &.open {
            @media (min-width: ${breakpoints.tablet}) {
                border: 1px solid ${palette.primary.gray};
                padding: 8px 7px 8px 7px;
            }
            @media (max-width: ${breakpoints.tablet}) {
                color: ${palette.secondary.textGray};
            }
        }
    }
    .sub-menu {
        display: flex;
        @media (min-width: ${breakpoints.tablet}) {
            position: absolute;
            margin-top: -1px;
            ${({ $leftOffset, $rightOffset }) =>
                $leftOffset ? `left: ${$leftOffset}px;` : `right: ${$rightOffset}px;`};
        }
    }
    .sub-menu-container {
        display: flex;
        flex: 1 1 280px;
        flex-direction: column;
        min-width: 240px;
        padding: 10px;
        @media (min-width: ${breakpoints.tablet}) {
            padding: 15px;
            border: 1px solid ${palette.primary.gray};
        }
        background-color: ${palette.primary.black};
        cursor: pointer;
    }
`;

export const StyledMenuItem = styled(motion.div)`
    display: flex;
    flex: 1 0 auto;
    flex-direction: row;
    text-align: start;
    text-decoration: none;
    margin-right: 0px;
    a {
        text-decoration: none;
    }

    @media (max-width: ${breakpoints.tablet}) {
        margin-bottom: 10px;
    }
    .sub-menu-icon {
        min-width: 35px;
        display: flex;
        justify-content: center;
        align-items: center;
        img {
            margin: 0 0.5rem 0 0;
        }
    }
    &.wallet-info {
        color: ${palette.secondary.textGray};
        font-size: 0.9rem;
        width: 280px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
`;
