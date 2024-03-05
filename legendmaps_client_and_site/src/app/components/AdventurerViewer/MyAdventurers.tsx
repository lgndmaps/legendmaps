import { useContext } from "react";
import { RootStoreContext } from "../../../stores/with-root-store";
import { IAdventurerD } from "../../../types/adventurerTypes";
import { AdventurersContainer } from "./adventurers.styles";
import AdventurerThumbnail from "./AdventurerThumbnail";
import { MyAdventurerInfiniteScroll } from "./MyAdventurerInfiniteScroll";

interface MyMapsProps {
    adventurers: IAdventurerD[];
    isConnected: boolean;
    loading: boolean;
}

const MyMaps = ({ adventurers, isConnected, loading }: MyMapsProps) => {
    const { adventurersStore, accountStore } = useContext(RootStoreContext);

    return (
        <div role="tabpanel">
            <div className="section-title">
                <h1>My Adventurers</h1>
            </div>
            {/* {isConnected && (
                <AdventurersContainer>
                    <div className="adventurer-list">
                        {adventurers.map((adventurer) => (
                            <AdventurerThumbnail adventurer={adventurer} isMine={true} />
                        ))}
                    </div>
                </AdventurersContainer>
            )} */}
            {isConnected && <MyAdventurerInfiniteScroll />}
            <div style={{ textAlign: "center" }}>
                {!isConnected
                    ? "Connect wallet or login to view your adventurers"
                    : loading
                    ? "Loading..."
                    : adventurers.length === 0
                    ? "You don't have any adventurers."
                    : ""}
            </div>
        </div>
    );
};

export default MyMaps;
