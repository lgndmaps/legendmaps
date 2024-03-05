import React from "react";
import Title from "../ui/Title";

interface IProps {
    title: string;
}

const TechnicalArchitecture = ({ title }: IProps) => {
    return (
        <div>
            <Title text={title} />
        </div>
    );
};

export default TechnicalArchitecture;
