import styled from "styled-components";
import { motion } from "framer-motion";
import { breakpoints, palette } from "../../../styles/styleUtils";

export const MobileMenuMotion = styled(motion.div)`
    @media (min-width: ${breakpoints.tablet}) {
        display: none;
    }
    position: fixed;
    background-color: #000;
    width: 280px;
    height: 100vh;
    box-sizing: border-box;
    box-shadow: 16px 0 32px -16px #000;
    padding: 32px 18px;
    z-index: 99;
    overflow-x: hidden;
    -moz-outline-radius-bottomright: 0;
    top: 0;
    left: 0;
    .spacer {
        height: 32px;
    }

    .button-row {
        display: flex;
        button:first-of-type {
            margin-right: 10px;
        }
    }

    .close-btn {
        position: absolute;
        top: 0;
        right: 0;
        padding: 25px;
    }

    .hr-divider {
        width: 100%;
        height: 1px;
        width: 198px;
        background-color: #fff;
        margin-top: 30px;
    }

    .mobile-nav-items {
        display: flex;
        flex-direction: column;
        margin-top: 35px;
        & > * {
            margin-bottom: 15px;
            font-size: 0.9rem;
        }
    }

    a {
        text-align: center;
        text-decoration: none;
        color: white;
        font-size: 0.9rem;
    }
    ul,
    li {
        list-style-type: none;
        margin: 10% 0 0 0;
        padding: 0;
        display: flex;
        span {
            text-align: start;
        }
    }
    .share-container {
        margin-top: 30%;
    }
    .secondary-links {
        font-size: 12px;
        font-weight: bold;
    }
`;

export const BackDrop = styled(motion.div)`
    opacity: 0.7;
    background-color: #000;
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 98;
`;
