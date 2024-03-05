import styled from "styled-components";

const LoaderDiv = styled.div`
    width: 100%;
    height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
`;

export type LoaderProps = {
    loaderMessage?: string;
};

const Loader = ({ loaderMessage = "Loading..." }: LoaderProps) => {
    return <LoaderDiv>{loaderMessage}</LoaderDiv>;
};

export default Loader;
