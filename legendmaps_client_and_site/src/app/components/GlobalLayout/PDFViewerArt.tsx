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
    return (
        <PDFViewerComponent
            lastUpdated=""
            documentName={"Adventurer's Art Inspiration"}
            filePath="/adv_art_inspirations.pdf"
        />
    );
};

export default PDFViewer;
