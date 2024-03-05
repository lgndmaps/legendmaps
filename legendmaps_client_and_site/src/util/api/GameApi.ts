import jwtDecode from "jwt-decode";
import settings from "../../settings";
import { JwtDecoded, PendingReward, RewardRequests } from "../../types/userTypes";
import Cookies from "js-cookie";
import { USER_COOKIES } from "../../constants/userValues";
import { SerializedCampaignResponse } from "../../game/types/models";

export const getGameCampaign = (uid): Promise<SerializedCampaignResponse | null | undefined> => {
    return fetch(`${settings.API_URL}/game/campaign/${uid}`, {
        credentials: "include",
    })
        .then(async (res) => {
            if (res.status === 200) {
                const jsonResponse = await res.text();
                if (!jsonResponse) {
                    return undefined;
                }
                const data = JSON.parse(jsonResponse);
                return data;
            } else {
                console.error(res);
                return null;
            }
        })
        .catch(async (e) => {
            const data = e;
            return null;
        });
};

export const startNewCampaign = (
    uid: number,
    advTokenId: number,
    powerupId: number | null,
): Promise<SerializedCampaignResponse | null> => {
    return fetch(`${settings.API_URL}/game/create/${uid}`, {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        method: "post",
        credentials: "include",
        body: JSON.stringify({ tokenId: advTokenId, powerupId }),
    })
        .then(async (res) => {
            if (res.status === 200) {
                const jsonResponse = await res.text();
                if (!jsonResponse) {
                    return null;
                }
                const data = JSON.parse(jsonResponse);
                return data;
            } else {
                console.error(res);
                return null;
            }
        })
        .catch(async (e) => {
            const data = e;
            console.error(data);
            return null;
        });
};

export const endRun = () => {
    return fetch(`${settings.API_URL}/game/session/end`, {
        method: "post",
        credentials: "include",
    })
        .then(async (res) => {
            if (res.status === 200) {
                const data = await res.json();
                return data.campaign as SerializedCampaignResponse;
            } else {
                return { error: res };
            }
        })
        .catch(async (e) => {
            const data = await e.json();
            return data;
        });
};

export const levelUp = (skillId: number) => {
    return fetch(`${settings.API_URL}/game/campaign/levelup`, {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        method: "post",
        credentials: "include",
        body: JSON.stringify({ selectedSkill: skillId }),
    })
        .then(async (res) => {
            if (res.status === 200) {
                const jsonResponse = await res.text();
                if (!jsonResponse) {
                    return null;
                }
                const data = JSON.parse(jsonResponse);
                return data as SerializedCampaignResponse;
            } else {
                const jsonResponse = await res.text();
                if (!jsonResponse) {
                    return null;
                }
                const data = JSON.parse(jsonResponse);

                console.error(data);
                return null;
            }
        })
        .catch(async (e) => {
            const data = e;
            console.error(data);
            return null;
        });
};

export const endCampaign = () => {
    return fetch(`${settings.API_URL}/game/campaign/end`, {
        method: "post",
        credentials: "include",
    })
        .then(async (res) => {
            if (res.status === 200) {
                const data = await res.json();
                return data;
            } else {
                return { error: res };
            }
        })
        .catch(async (e) => {
            const data = await e.json();
            return data;
        });
};

export const refreshOwnedAdventurers = () => {
    return fetch(`${settings.API_URL}/users/refresh-owned`, {
        method: "post",
        credentials: "include",
    })
        .then(async (res) => {
            if (res.status === 200) {
                const data = await res.json();
                return data;
            } else {
                const err = await res.json();
                return { ...err };
            }
        })
        .catch(async (e) => {
            const data = await e.json();
            return data;
        });
};

export const fetchPendingRewards = (): Promise<{ rewards?: PendingReward[]; nonce?: number; error?: string }> => {
    return fetch(`${settings.API_URL}/game/get-rewards`, {
        method: "post",
        credentials: "include",
    })
        .then(async (res) => {
            if (res.status === 200) {
                const data = await res.json();
                return { rewards: data.pendingRewards as PendingReward[], nonce: data.currentNonce };
            } else {
                return { error: res };
            }
        })
        .catch(async (e) => {
            const data = await e.json();
            return data;
        });
};

export const fetchRedeemedRewards = (): Promise<{ rewards?: RewardRequests[]; nonce?: number; error?: string }> => {
    return fetch(`${settings.API_URL}/game/get-redeemed-rewards`, {
        method: "post",
        credentials: "include",
    })
        .then(async (res) => {
            if (res.status === 200) {
                const data = await res.json();
                return { rewards: data.redeemedRewards as RewardRequests[], nonce: data.currentNonce };
            } else {
                return { error: res };
            }
        })
        .catch(async (e) => {
            const data = await e.json();
            return data;
        });
};

export const redeemSingleReward = (id: number): Promise<RewardRequests[]> => {
    return fetch(`${settings.API_URL}/game/claim-single`, {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        method: "post",
        credentials: "include",
        body: JSON.stringify({
            rewardId: id,
        }),
    })
        .then(async (res) => {
            if (res.status === 200) {
                const data = await res.json();
                return data.rewardRequests as RewardRequests[];
            } else {
                const data = await res.json();
                throw new Error(data.error);
            }
        })
        .catch(async (e) => {
            const data = await e.json();
            throw new Error(data.error);
        });
};

export const redeemRewards = (): Promise<RewardRequests[] | { error: string }> => {
    return fetch(`${settings.API_URL}/game/claim-all`, {
        method: "post",
        credentials: "include",
    })
        .then(async (res) => {
            if (res.status === 200) {
                const data = await res.json();
                return data.rewardRequests as RewardRequests[];
            } else {
                return { error: res };
            }
        })
        .catch(async (e) => {
            const data = await e.json();
            return data;
        });
};

export const getAvailableMaps = () => {
    return fetch(`${settings.API_URL}/game/mapOptions`, {
        method: "get",
        credentials: "include",
    })
        .then(async (res) => {
            if (res.status === 200) {
                const data = JSON.parse(await res.text());
                return data;
            } else {
                return { error: res };
            }
        })
        .catch(async (e) => {
            const data = e;
            return data;
        });
};

export const getGameSession = (uid, userToken) => {
    return fetch(`${settings.API_URL}/game/session/${uid}`, {
        method: "get",
        credentials: "include",
    })
        .then(async (res) => {
            if (res.status === 200) {
                const data = JSON.parse(await res.text());
                return data;
            } else {
                return { error: res };
            }
        })
        .catch(async (e) => {
            const data = e;
            return data;
        });
};

export const startGameSession = (uid, tokenId: number) => {
    return fetch(`${settings.API_URL}/game/session/create/${uid}`, {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        method: "post",
        body: JSON.stringify({ tokenId: tokenId }),
        credentials: "include",
    })
        .then(async (res) => {
            if (res.status === 200) {
                const data = await res.json();
                return data;
            } else {
                const data = await res.json();
                console.error(data);
                return null;
            }
        })
        .catch(async (e) => {
            const data = await e.json();
            console.error(data);
            return null;
        });
};

export const endGameSession = (uid) => {
    return fetch(`${settings.API_URL}/game/session/end/${uid}`, {
        method: "post",
        credentials: "include",
    })
        .then(async (res) => {
            if (res.status === 200) {
                const data = await res.json();
                return data;
            } else {
                return { error: res };
            }
        })
        .catch(async (e) => {
            const data = await e.json();
            return data;
        });
};

export const sendInput = (input: string) => {
    const token = Cookies.get(USER_COOKIES.LM_JWT);
    const {
        payload: { id },
    } = jwtDecode<JwtDecoded>(token);
    return fetch(`${settings.API_URL}/game/move/${id}`, {
        method: "PATCH",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({ input: input }),
    })
        .then(async (res) => {
            if (res.status === 200) {
                const data = await res.json();
                return data;
            } else {
                return { error: res };
            }
        })
        .catch(async (e) => {
            const data = await e.json();
            return data;
        });
};
