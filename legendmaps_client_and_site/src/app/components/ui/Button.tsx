import * as React from "react";
import styled from "styled-components";
import Chevron from "../../../assets/icons/Chevron";
import { palette } from "../../../styles/styleUtils";

type Props = {
    className?: string;
    children?: React.ReactNode;
    size?: "small" | "medium" | "large";
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    disabled?: boolean;
    hasChevron?: boolean;
};

const ButtonElement = styled.button<Props>`
    display: flex;
    position: relative;
    justify-content: center;
    align-items: center;
    text-decoration: none;
    border: 2px solid ${palette.primary.gray};
    color: white;
    max-width: 250px;
    padding: 0.2em 1em 0 1em;
    line-height: 37px;

    &.small {
        font-size: 16px;
        padding: 0px 10px;
        border-radius: 5px;
        border-color: #fff;
    }

    .label {
        &.chevron {
            padding-right: 22px;
        }
    }

    i {
        position: absolute;
        right: 0;
        top: 46%;
        transform: translate(-35%, -50%);
    }
`;

export default function Button(props: Props) {
    const { size, children, hasChevron } = props;
    return (
        <ButtonElement className={`${size === "small" && "small"}`} {...props}>
            <div className={`label  ${hasChevron ? "chevron" : ""}`}>{children}</div>
            {hasChevron && <Chevron />}
        </ButtonElement>
    );
}
