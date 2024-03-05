import { IDiscordSession, ISession, JwtDecoded } from "../types/userTypes";
import Cookies from "js-cookie";
import { USER_COOKIES } from "../constants/userValues";
import axios from "axios";
import { QueryClient, useQueryClient } from "react-query";
import { QUERIES } from "../constants/Queries";
import settings from "../settings";
import Web3 from "web3";
import { useRootStore } from "../store";
import ethers from "ethers";
import { hexlify } from "@ethersproject/bytes";
import { toUtf8Bytes } from "@ethersproject/strings";
import jwtDecode from "jwt-decode";
import { SiweMessage, SignatureType } from "../packages/siwe/siwe";
let web3: Web3 | undefined = undefined;

export const getSession = async (userToken?: string): Promise<ISession | null> => {
    return new Promise((resolve, reject) => {
        return fetch(`${settings.API_URL}/users/me`, {
            credentials: "include",
        }).then(async (res) => {
            try {
                const response = await res.json();
                if (res.status === 200) {
                    resolve(response);
                }
                if (res.status === 422) {
                    resolve(null);
                }
                if (res.status >= 400) {
                    if (response?.errors?.session) {
                        reject(new Error(response.errors.session));
                    } else {
                        reject(new Error("Sorry, something went wrong"));
                    }
                } else {
                    reject(new Error("Sorry, something went wrong"));
                }
            } catch {
                reject(new Error("Sorry, something went wrong"));
            }
        });
    });
};

export const getDiscordSession = async (userToken: string): Promise<IDiscordSession | null> => {
    return new Promise((resolve, reject) => {
        return fetch(`https://discordapp.com/api/v6/users/@me`, {
            method: "get",
            headers: {
                Authorization: `Bearer ${userToken}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
        }).then(async (res) => {
            const response = await res.json();
            if (res.status === 200) {
                resolve(response);
            }
            if (res.status >= 400) {
                if (response?.errors?.session) {
                    reject(new Error(response.errors.session));
                } else {
                    reject(new Error("Sorry, something went wrong"));
                }
            } else {
                reject(new Error("Sorry, something went wrong"));
            }
        });
    });
};

export const getDiscordToken = async (code: string) => {
    Cookies.remove(USER_COOKIES.DISCORD_STATE);
    return new Promise((resolve, reject) => {
        return fetch("/api/discord/login", {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({ code }),
        })
            .then(async (res) => {
                const data = await res.json();
                Cookies.set(USER_COOKIES.DISCORD_TOKEN, data?.access_token);
                resolve(data);
            })
            .catch(async (e) => {
                const data = await e.json();
                reject(new Error("Something went wrong"));
            });
    });
};

export const getUserGuilds = async (userToken: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        return fetch(`https://discordapp.com/api/v6/users/@me/guilds`, {
            method: "get",
            headers: {
                Authorization: `Bearer ${userToken}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
        }).then(async (res) => {
            const response = await res.json();
            if (res.status === 200) {
                resolve(response);
            }
            if (res.status >= 400) {
                if (response?.errors?.session) {
                    reject(new Error(response.errors.session));
                } else {
                    reject(new Error("Sorry, something went wrong"));
                }
            } else {
                reject(new Error("Sorry, something went wrong"));
            }
        });
    });
};

const assingRole = async (uid, id) => {
    return fetch(`${settings.API_URL}/users/${id}/discord`, {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            credentials: "include",
        },
        method: "PATCH",
        body: JSON.stringify({ discordId: uid }),
    })
        .then(async (res) => {
            const data = await res.json();
            return data;
        })
        .catch(async (e) => {
            const data = await e.json();
            return data;
        });
};

export const verifyDiscord = async (uid, userId) => {
    const token = Cookies.get(USER_COOKIES.DISCORD_TOKEN);
    const uToken = Cookies.get(USER_COOKIES.LM_JWT);
    return getUserGuilds(token)
        .then(async (res) => {
            if (res.length) {
                if (res.findIndex((g) => (g.id = settings.DISCORD_SERVER_ID)) >= 0) {
                    return assingRole(uid, userId);
                } else {
                    console.debug("not member");
                }
            }
        })
        .catch(async (e) => {
            const data = await e.json();
        });
};

export const login = async (queryClient: QueryClient) => {
    queryClient.setQueryData(QUERIES.DISCORD_ACCOUNT, null);
};

export const discordLogout = async (queryClient: QueryClient) => {
    Cookies.remove(USER_COOKIES.DISCORD_TOKEN);
    queryClient.setQueryData(QUERIES.DISCORD_ACCOUNT, null);
};

export const logout = async () => {
    return await fetch(`${settings.API_URL}/auth/logout`, {
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        method: "POST",
    })
        .then((response) => {
            const res = response.json();
            return res;
        })
        .catch((e) => {
            console.log(e);
        });
};

export const checkIfUserExists = async (publicAddress: String) => {
    const response = await fetch(`${settings.API_URL}/users?publicAddress=${publicAddress}`);
    return await response.json();
};

export const handleSignup = async (publicAddress: string) => {
    return fetch(`${settings.API_URL}/users`, {
        body: JSON.stringify({ publicAddress }),
        headers: {
            "Content-Type": "application/json",
        },
        method: "POST",
    })
        .then((response) => {
            const res = response.json();
        })
        .catch((e) => {
            console.log(e);
        });
};

export const handleAuthenticate = ({
    publicAddress,
    message,
    ens,
}: {
    publicAddress: string;
    message: SiweMessage;
    ens: string;
}) => {
    return fetch(`${settings.API_URL}/auth`, {
        body: JSON.stringify({ publicAddress, message, ens }),
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        method: "POST",
    }).then(async (response) => {
        const res = await response.text();
        console.log(res);
        if (res) {
            Cookies.set(USER_COOKIES.LM_JWT, res);
        }
        return res;
    });
};

export const handleSignMessage = async ({
    publicAddress,
    nonce,
    provider,
}: {
    publicAddress: string;
    nonce: string;
    provider;
}) => {
    try {
        const date = new Date();
        date.setDate(date.getDate() + 30);
        const message = new SiweMessage({
            domain: document.location.host,
            address: publicAddress,
            chainId: `${await provider.getNetwork().then(({ chainId }) => chainId)}`,
            uri: document.location.origin,
            version: "1",
            statement: "Legend Maps",
            type: SignatureType.PERSONAL_SIGNATURE,
            nonce,
            expirationTime: date.toISOString(),
        });
        const signature = await provider.getSigner().signMessage(message.signMessage());

        message.signature = signature;
        return { publicAddress, message };
    } catch (err) {
        console.log(err);
        throw new Error("You need to sign the message to be able to log in.");
    }
};

export const startAuth = async (publicAddress: string, provider, ens: string): Promise<string | void> => {
    const users = await checkIfUserExists(publicAddress);
    let user = null;
    if (users.length) {
        user = users[0];
    } else {
        user = await handleSignup(publicAddress);
    }
    const nonce = await fetch(`${settings.API_URL}/auth/nonce`, {
        credentials: "include",
    }).then(async (response) => {
        const res = await response.text();
        return res;
    });

    const signMessageResponse = await handleSignMessage({ publicAddress: user.publicAddress, nonce, provider });

    return handleAuthenticate({ ...signMessageResponse, ens });
    // return checkIfUserExists(publicAddress)
    //   .then((response) => response.json())
    //   .then((users) => {
    //     return users.length ? users[0] : handleSignup(publicAddress);
    //   })
    //   .then((response) => handleSignMessage({ ...response, provider }))
    //   .then(handleAuthenticate)
    //   .catch((e) => {
    //     console.error(e);
    //   });
};
