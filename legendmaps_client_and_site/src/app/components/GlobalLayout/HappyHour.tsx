import { useState } from "react";
import { Document, Page } from "react-pdf";
import url from "pdfjs-dist/build/pdf.worker";
import settings from "../../../settings";
import Button from "../ui/Button";
import { useRouter } from "next/router";
import styled from "styled-components";

const PDFStyled = styled.div`
    text-align: center;
    a {
        margin: 20px auto;
    }
`;

const HappyHour = (): JSX.Element => {
    const router = useRouter();
    return (
        <iframe
            className="airtable-embed"
            src="https://airtable.com/embed/shrMyAZGTACxWx2Af?backgroundColor=gray"
            frameBorder="0"
            width="100%"
            height="1200"
            style={{ backgroundColor: "white" }}
        ></iframe>
    );
};

export default HappyHour;
