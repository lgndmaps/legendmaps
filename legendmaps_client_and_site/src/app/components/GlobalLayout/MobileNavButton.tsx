import styled from "styled-components";
import { breakpoints } from "../../../styles/styleUtils";
export const StyledMenuButton = styled.button`
    display: flex;
    align-items: center;
    margin-right: 10px;
    padding: 10px 0 10px;
    &:hover {
        background: transparent !important;
    }
    margin-left: auto;
    @media (min-width: ${breakpoints.tablet}) {
        display: none;
    }
`;
interface Props {
    toggle: () => void;
}
const MobileNavButton = ({ toggle }: Props) => {
    return (
        <StyledMenuButton onClick={toggle}>
            <svg width="18" height="18" viewBox="0 0 24 24" strokeWidth="3" stroke={"white"}>
                <title>Mobile Menu</title>
                {/* TODO Animate and toggle menu */}
                <path d="M 0 1.5 L 24 1.5" />
                <path d="M 0 9.423 L 24 9.423" />
                <path d="M 0 17.346 L 24 17.346" />
            </svg>
        </StyledMenuButton>
    );
};

export default MobileNavButton;
