import { useRouter } from "next/router";
import { useEffect } from "react";
import { useRootStore } from "../../../store";
import ClientOnly from "../../../util/ClientOnly";

export const OwnerOnly = ({ children }) => {
    const {
        accountStore: {
            user,
            initialLoadAttempted,
            featureFlags: { devMode },
        },
        gameStore,
    } = useRootStore();
    const router = useRouter();
    useEffect(() => {
        if (initialLoadAttempted) {
            if (user?.role !== "adv-owner" && user?.role !== "admin") {
                router.push("/");
            }
        }
    }, [user]);
    return <ClientOnly>{(user?.role === "adv-owner" || user?.role === "admin") && { children }}</ClientOnly>;
};
