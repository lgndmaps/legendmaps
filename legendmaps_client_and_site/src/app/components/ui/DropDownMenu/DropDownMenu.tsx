import React from "react";
import { motion } from "framer-motion";
import { IHeaderNavLink } from "../../GlobalLayout/Header";
import { StyledMenuContainer } from "./DropDownMenu.styled";
import { useBreakpoints } from "../../../../styles/styleUtils";

const subMenuAnimate = {
    enter: {
        opacity: 1,
        transition: {
            duration: 0.2,
            ease: "easeInOut",
        },
        height: "auto",
        display: "flex",
    },
    exit: {
        opacity: 0,
        transition: {
            duration: 0.2,
            ease: "easeInOut",
        },
        height: 0,
        transitionEnd: {
            display: "none",
        },
    },
};
interface IProps {
    title: string;
    children: React.ReactNode;
    leftOffset?: number;
    rightOffset?: number;
}

const DropDownMenu = ({ title, leftOffset, rightOffset, children }: IProps) => {
    const [isOpen, setOpen] = React.useState(false);
    const { isTabletCeil } = useBreakpoints();
    const handleHoverOpen = (open) => {
        !isTabletCeil && setOpen(open);
    };

    const handleClickOpen = () => {
        setOpen(!isOpen);
    };

    return (
        <StyledMenuContainer
            className="menu-item"
            onMouseEnter={() => handleHoverOpen(true)}
            onMouseLeave={() => handleHoverOpen(false)}
            onClick={handleClickOpen}
            initial="exit"
            // $  marks transient props for styled components so they don't end up on the dom and throw an error
            $leftOffset={leftOffset}
            $rightOffset={rightOffset}
            animate={isOpen ? "enter" : "exit"}
        >
            <div className={`title ${isOpen ? "open" : "closed"}`}>{title}</div>
            <motion.div className="sub-menu" variants={subMenuAnimate}>
                <div className="sub-menu-container">{children}</div>
            </motion.div>
        </StyledMenuContainer>
    );
};

export default DropDownMenu;
