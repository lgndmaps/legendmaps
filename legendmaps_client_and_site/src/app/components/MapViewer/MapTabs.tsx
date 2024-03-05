import styled from "styled-components";
import { palette } from "../../../styles/styleUtils";

export interface MapTabProps {
    tabs: string[];
    activeTab: number;
    onClick: (id: number) => void;
}

const TabsWrapper = styled.div`
    display: flex;
    justify-content: center;
    position: relative;
    .divider {
        height: 60px;
        width: 2px;
        background: ${palette.primary.gray};
    }
    button {
        color: ${palette.primary.gray} !important;
        position: absolute;
        background: none;
        left: 50%;
        top: 50%;
        transform: translateY(-50%);
        padding: 20px 40px;
        &.active {
            border-bottom: 2px solid ${palette.primary.gray};
        }
        &:first-child {
            margin-right: 20px;
            left: initial;
            right: 50%;
        }
        &:not(:first-child) {
            margin-left: 20px;
        }
    }
`;

const MapTabs = ({ tabs, activeTab, onClick }: MapTabProps) => {
    return (
        <TabsWrapper role="tablist" key="map-tabs">
            {tabs.map((tab, i) => {
                const idx = i;
                return (
                    <button
                        className={`map-tab ${activeTab === idx ? "active" : ""}`}
                        role="tab"
                        aria-selected={activeTab === idx}
                        onClick={() => {
                            onClick(idx);
                        }}
                    >
                        {tab}
                    </button>
                );
            })}
            <div className="divider"></div>
        </TabsWrapper>
    );
};

export default MapTabs;
