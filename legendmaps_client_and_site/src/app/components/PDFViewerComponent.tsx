import React, { useState } from "react";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack5";
import styled from "styled-components";
import { niceScrollbars } from "../../styles/styleUtils";
import { css } from "@emotion/react";
interface PDFViewerProps {
    filePath: string;
    lastUpdated?: string;
    documentName: string;
}

export const PDFViewerComponent = ({ filePath, documentName, lastUpdated }: PDFViewerProps) => {
    const [numPages, setNumPages] = useState(null);

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    return (
        <div css={{ display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center" }}>
            <a href="/gdd.pdf" rel="noopener" target="_blank">
                Download the current {documentName} [PDF]
            </a>
            <br />
            {lastUpdated && <>(last update: {lastUpdated})</>}
            <PDFWrapper
                css={css`
                    ${niceScrollbars}
                `}
            >
                <Document
                    renderInteractiveForms={true}
                    renderAnnotationLayer={true}
                    file={filePath}
                    onLoadSuccess={onDocumentLoadSuccess}
                >
                    {Array.from(new Array(numPages), (el, index) => (
                        <Page
                            width={Math.min(window.innerWidth - 80, 800)}
                            key={`page_${index + 1}`}
                            pageNumber={index + 1}
                        />
                    ))}
                </Document>
            </PDFWrapper>
        </div>
    );
};

const PDFWrapper = styled.div`
    height: calc(100vh - 400px);
    overflow-y: auto;
    canvas {
        margin: 0 auto;
    }
`;

const PageInput = styled.input`
    background: black;
    border: 1px solid #fff;
    margin-right: 5px;
`;
