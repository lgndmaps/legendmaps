import React from "react";
import Title from "../ui/Title";

interface IProps {
    title: string;
}

const ClosedBeta = ({ title }: IProps) => {
    return (
        <div>
            <Title text={title} />
        </div>
    );
};

export default ClosedBeta;
