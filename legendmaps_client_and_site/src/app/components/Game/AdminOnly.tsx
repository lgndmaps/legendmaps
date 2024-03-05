import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useRootStore } from "../../../store";
import ClientOnly from "../../../util/ClientOnly";

export const AdminOnly = observer(({ children }) => {
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
            if (user?.role !== "admin") {
                router.push("/");
            }
        }
    }, [user, initialLoadAttempted]);
    return (
        <div>
            <ClientOnly>{user?.role === "admin" ? <>{children}</> : <div></div>}</ClientOnly>
        </div>
    );
});
