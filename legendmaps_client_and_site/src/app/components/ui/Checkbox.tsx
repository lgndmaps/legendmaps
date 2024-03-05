import styled from "styled-components";
import React from "react";

export type CheckboxProps = {
    label: string;
    checked: boolean;
    onClick: () => void;
};

export const Checkbox = ({ label, checked, onClick }) => {
    return (
        <CheckboxStyled>
            <label className="form-control">
                <input type="checkbox" name="checkbox" onClick={onClick} checked={checked} />
                {label}
            </label>
        </CheckboxStyled>
    );
};

const CheckboxStyled = styled.div`
    .form-control {
        font-size: 16px;
        font-weight: bold;
        line-height: 1.1;
        display: flex !important;
        flex-direction: row !important;
    }

    .form-control + .form-control {
        margin-top: 1em;
    }

    .form-control--disabled {
        color: var(gray);
        cursor: not-allowed;
    }

    input[type="checkbox"] {
        /* Add if not using autoprefixer */
        -webkit-appearance: none;
        /* Remove most all native input styles */
        appearance: none;
        /* For iOS < 15 */
        background-color: var(--form-background);
        /* Not removed via appearance */
        margin: 0;
        margin-right: 5px;

        font: inherit;
        color: #fff;
        width: 1.15em;
        height: 1.15em;
        border: 0.15em solid #fff;
        border-radius: 0.15em;
        transform: translateY(-0.075em);

        display: grid;
        place-content: center;
    }

    input[type="checkbox"]::before {
        content: "";
        width: 0.65em;
        height: 0.65em;
        clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
        transform: scale(0);
        transform-origin: bottom left;
        box-shadow: inset 1em 1em #fff;
        /* Windows High Contrast Mode */
        background-color: #fff;
    }

    input[type="checkbox"]:checked::before {
        transform: scale(1);
    }

    input[type="checkbox"]:disabled {
        --form-control-color: var(--form-control-disabled);

        color: var(--form-control-disabled);
        cursor: not-allowed;
    }
`;
