import styled from "styled-components";

const StyledChevron = styled.i`
    box-sizing: border-box;
    position: relative;
    display: block;
    transform: scale(var(--ggs, 1));
    width: 22px;
    height: 22px;
    border: 2px solid transparent;
    border-radius: 100px;

    &:after {
        content: "";
        display: block;
        box-sizing: border-box;
        position: absolute;
        width: 13px;
        height: 13px;
        border-bottom: 1px solid;
        border-right: 1px solid;
        transform: rotate(-45deg);
        right: 6px;
        top: 4px;
    }
`;

// TODO handle directions on props if needed

const Chevron = () => <StyledChevron />;

export default Chevron;
