import settings from "../../settings";
import { ProjectIds } from "../../types/web3";

export const claimAllowlist = async (project: string) => {
    const response = await fetch(`${settings.API_URL}/allowlist/${project}`, {
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        method: "POST",
    });

    return await response.json();
};

export const checkAllowlist = async () => {
    const response = await fetch(`${settings.API_URL}/allowlist/me`, {
        credentials: "include",
    });
    return await response.json();
};

export const allowlistCount = async (project: ProjectIds) => {
    const response = await fetch(`${settings.API_URL}/allowlist/count/${project}`, {
        credentials: "include",
    });
    return await response.json();
};

export const updateAdventurerDescription = async (tokenId: number, description: string) => {
    const response = await fetch(`${settings.API_URL}/adventurers/${tokenId}/description`, {
        headers: {
            "Content-Type": "application/json",
        },
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ description }),
    });
    return await response.json();
};
