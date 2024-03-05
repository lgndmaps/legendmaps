import { observer } from "mobx-react-lite";
import dynamic from "next/dynamic";
import { useContext, useEffect, useState } from "react";
import { ADVENTURER_SEARCH_FIELDS } from "../../../constants/adventurerConstants";
import { MapsSelectionWrapper } from "../../../pages/maps";
import { RootStoreContext } from "../../../stores/with-root-store";
import { IMapD } from "../../../types/mapTypes";
import { refreshOwnedAdventurers } from "../../../util/api/GameApi";
import Button from "../ui/Button";
const DynamicMyMaps = dynamic(() => import("../MapViewer/MyMaps"), {
    ssr: false,
});
const DynamicMyAdventurers = dynamic(() => import("../AdventurerViewer/MyAdventurers"), {
    ssr: false,
});
export const UserProfile = observer(() => {
    const { mapsStore: mapsContractStore, adventurersStore, accountStore, errorStore } = useContext(RootStoreContext);
    const { user } = accountStore;
    const [adventurerLoadError, setAdventurerLoadError] = useState<string>("");
    const [isFetchingNextPage, setIsFetchingNextPage] = useState<boolean>(false);
    const [refreshingOwned, setRefreshingOwned] = useState<boolean>(false);
    const getUserMaps = async () => {
        mapsContractStore.loadUserMaps();
    };

    useEffect(() => {
        getUserMaps();
    }, [user]);

    if (!user) {
        return <>Log in to view your profile</>;
    }

    return (
        <>
            <Button
                onClick={async () => {
                    setRefreshingOwned(true);
                    const res = await refreshOwnedAdventurers();
                    if (res.error) {
                        console.log(res.error);
                        errorStore.setErrorPopup(res.error);
                    }
                    setRefreshingOwned(false);
                }}
                disabled={refreshingOwned}
            >
                {refreshingOwned ? "Refreshing..." : "Refresh Owned Adventurers"}
            </Button>
            <MapsSelectionWrapper>
                <DynamicMyMaps maps={mapsContractStore.userMaps} isConnected={!!user?.publicAddress} />
                <DynamicMyAdventurers
                    adventurers={adventurersStore.adventurersList}
                    isConnected={!!user?.publicAddress}
                    loading={isFetchingNextPage}
                />
            </MapsSelectionWrapper>
        </>
    );
});
