import { useQuery, UseQueryResult } from "react-query";
import Cookies from "js-cookie";
import { getDiscordSession, getSession } from "../../util/auth";
import { QUERIES } from "../../constants/Queries";
import { IDiscordSession, ISession } from "../../types/userTypes";
import { USER_COOKIES } from "../../constants/userValues";

export const useDiscordQuery = (): UseQueryResult<IDiscordSession> => {
    const token = Cookies.get(USER_COOKIES.DISCORD_TOKEN);
    // Enabled takes care of the token being undefined
    return useQuery(QUERIES.DISCORD_ACCOUNT, () => getDiscordSession(token!), {
        staleTime: 1000 * 60 * 60 * 10000,
        enabled: !!token,
    });
};

export const useSessionQuery = (): UseQueryResult<ISession> => {
    const token = Cookies.get(USER_COOKIES.LM_JWT);
    // Enabled takes care of the token being undefined
    return useQuery(QUERIES.LM_SESSION, () => getSession(""), {
        staleTime: 1000 * 60 * 60 * 10000,
        enabled: true,
        refetchOnWindowFocus: false,
        onError: (err) => {
            console.log("error");
        },
    });
};
