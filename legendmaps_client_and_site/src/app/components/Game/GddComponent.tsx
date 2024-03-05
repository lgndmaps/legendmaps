import React from "react";
import Button from "../ui/Button";
import Title from "../ui/Title";

const GddComponent = ({ title }) => {
    return (
        <div>
            <Title text={title} />
            <Button>Button</Button>
        </div>
    );
};

export default GddComponent;
