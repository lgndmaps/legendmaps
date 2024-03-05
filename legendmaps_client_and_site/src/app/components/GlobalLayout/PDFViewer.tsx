import { useState } from "react";
import settings from "../../../settings";
import Button from "../ui/Button";
import { useRouter } from "next/router";
import styled from "styled-components";
import { PDFViewerComponent } from "../PDFViewerComponent";

const PDFStyled = styled.div`
    text-align: center;
    a {
        margin: 20px auto;
    }
`;

const PDFViewer = (): JSX.Element => {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }
    const router = useRouter();
    return <PDFViewerComponent lastUpdated="Jan 28, 2022" documentName={"Game Design Document"} filePath="/gdd.pdf" />;
};

export default PDFViewer;
