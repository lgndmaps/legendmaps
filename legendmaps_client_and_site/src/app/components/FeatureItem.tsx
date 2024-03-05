import * as React from "react";

interface IProps {
    title: string;
    contents?: React.ReactNode;
}

const FeatureItem = ({ title, contents }: IProps) => (
    <p style={{ paddingLeft: "1.5em", textIndent: "-1.5em", marginBottom: "1.5em" }}>
        <span
            style={{
                backgroundColor: "white",
                color: "black",
                paddingTop: ".05em",
                paddingBottom: ".05em",
                paddingLeft: ".15em",
                paddingRight: ".15em",
                fontWeight: "bold",
            }}
        >
            {title}
        </span>
        {contents}
    </p>
);

export default FeatureItem;
