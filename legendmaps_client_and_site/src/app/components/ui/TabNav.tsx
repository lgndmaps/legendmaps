import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import styled from "styled-components";
import { palette, breakpoints } from "../../../styles/styleUtils";
import { ITab } from "../../../types/tabTypes";

const TabsWrapper = styled.div`
    display: flex;
    justify-content: center;
    margin-bottom: 15px;
    .divider {
        height: 60px;
        width: 2px;
        background: ${palette.primary.gray};
    }
    button {
        border-bottom: 2px solid ${palette.primary.black};
        background: none;
        flex: 0 1 160px;
        word-wrap: normal;
        &.active {
            border-bottom: 2px solid ${palette.primary.gray};
        }
        &:hover {
            background: none;
            color: white;
            &:not(.active) {
                border-color: ${palette.primary.black};
            }
        }
        margin: 0 20px;
        @media (max-width: ${breakpoints.mobile}) {
            margin: 0 10px;
        }
    }
`;

const itemVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.2 } },
};

export interface TabProps {
    tabs: ITab[];
}

const Tabs = ({ tabs }: TabProps) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const handleSetActiveTab = (i) => {
        setActiveIndex(i);
    };
    const tabLength = tabs.length;
    tabs[activeIndex].component;
    return (
        <>
            <TabsWrapper role="tablist" key="tabs">
                {tabs.map((tab, i) => {
                    const isLast = tabLength === i + 1;
                    return (
                        <>
                            <button
                                key={tab.key}
                                className={`tab ${activeIndex === i ? "active" : ""}`}
                                role="tab"
                                aria-selected={activeIndex === i}
                                aria-controls={`tab_${tab.key}`}
                                onClick={() => {
                                    handleSetActiveTab(i);
                                }}
                            >
                                {tab.label}
                            </button>
                            {!isLast && <div className="divider"></div>}
                        </>
                    );
                })}
            </TabsWrapper>
            {tabs.map((tab, i) => {
                const isActive = i === activeIndex;
                if (isActive) {
                    return (
                        <AnimatePresence>
                            <motion.div
                                key={tab.key}
                                className="tab-content"
                                variants={itemVariants}
                                initial="initial"
                                animate="animate"
                                exit="initial"
                                role="tabpanel"
                                aria-labelledby={`tab_${tab.key}`}
                            >
                                {tab.component}
                            </motion.div>
                        </AnimatePresence>
                    );
                }
            })}
        </>
    );
};

export default Tabs;
