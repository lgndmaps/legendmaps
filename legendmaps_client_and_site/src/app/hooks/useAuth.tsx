import { createContext, useContext, useState } from "react";
import Cookies from "js-cookie";
import { IAuthContext } from "../../types/userTypes";
import { UseMutateFunction, useQueryClient } from "react-query";
import { useEffect } from "react";
import { useSessionQuery } from "./useSessionQuery";
import { USER_COOKIES } from "../../constants/userValues";
import { QUERIES } from "../../constants/Queries";
import { useRootStore } from "../../store";
import { getSession, logout, startAuth } from "../../util/auth";

const AuthContext = createContext({} as IAuthContext);

export const AuthProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [loggingIn, setLoggingIn] = useState(false);
    const [loginError, setLoginError] = useState<string | null>(null);
    const token = Cookies.get(USER_COOKIES.LM_JWT);
    const queryClient = useQueryClient();
    const { data: user, isLoading: isLoadingUserSession, isFetching } = useSessionQuery();

    if (token && user === null && !isLoadingUserSession && !isFetching) {
        console.warn("No user invalidate and refresh");
    }

    useEffect(() => {
        setIsLoading(isLoadingUserSession);
    }, [user, isLoadingUserSession]);

    useEffect(() => {
        if (user) {
            setIsLoading(false);
        }
    }, [user]);

    const startLogout = async (): Promise<void> => {
        Cookies.remove(USER_COOKIES.LM_JWT);
        queryClient.setQueryData(QUERIES.LM_SESSION, null);
        await logout();
    };

    const login = async (publicAddress: string, provider, ens: string) => {
        setLoggingIn(true);
        await startAuth(publicAddress, provider, ens !== "" ? ens : publicAddress);
        setLoggingIn(false);
        const userData = await getSession("");
        if (userData) {
            queryClient.setQueryData(QUERIES.LM_SESSION, userData);
        } else {
            setLoginError("Something went wrong. Please try again");
            setTimeout(() => {
                setLoginError(null);
            }, 1500);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                logout: startLogout,
                login,
                loggingIn,
                loginError,
                isLoading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
