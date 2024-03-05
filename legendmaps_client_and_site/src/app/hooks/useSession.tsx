import { createContext, useContext, useState } from "react";
import Cookies from "js-cookie";
import { ISessionContext } from "../../types/userTypes";
import { UseMutateFunction, useQueryClient } from "react-query";
import { useEffect } from "react";
import { useSessionQuery } from "./useSessionQuery";
import { USER_COOKIES } from "../../constants/userValues";
import { QUERIES } from "../../constants/Queries";
import { getSession, startAuth } from "../../util/auth";
import { IMapD } from "../../types/mapTypes";

const SessionContext = createContext({} as ISessionContext);

export const SessionProvider = ({ children }) => {
    const [myMaps, setMyMaps] = useState([]);
    const [viewingMap, setViewingMap] = useState<number | null>(null);
    const [viewingAdventurer, setViewingAdventurer] = useState<number | null>(null);
    const [viewingMyMaps, setViewingMyMaps] = useState<boolean>(false);
    const [loadedMaps, setLoadedMaps] = useState<Array<IMapD>>([]);
    const token = Cookies.get(USER_COOKIES.LM_JWT);
    const queryClient = useQueryClient();
    const { data: user, isLoading: isLoadingUserSession, isFetching } = useSessionQuery();

    return (
        <SessionContext.Provider
            value={{
                myMaps,
                viewingMap,
                viewingMyMaps,
                loadedMaps,
                viewingAdventurer,
                setMyMaps,
                setViewingMap,
                setViewingMyMaps,
                setLoadedMaps,
                setViewingAdventurer,
            }}
        >
            {children}
        </SessionContext.Provider>
    );
};

export const useSession = () => useContext(SessionContext);
