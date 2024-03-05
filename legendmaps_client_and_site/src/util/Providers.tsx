import { useContext, useRef } from "react";
import { ThemeProvider } from "styled-components";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { Hydrate } from "react-query/hydration";

import { theme } from "../styles/theme";
import { AuthProvider } from "../app/hooks/useAuth";
import { SessionProvider } from "../app/hooks/useSession";
import { RootStoreContext } from "../stores/with-root-store";

import "@rainbow-me/rainbowkit/styles.css";

import {
    getDefaultWallets,
    RainbowKitProvider,
    createAuthenticationAdapter,
    RainbowKitAuthenticationProvider,
    darkTheme,
} from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, createStorage, WagmiConfig } from "wagmi";
import { infuraProvider } from "wagmi/providers/infura";
import settings from "../settings";
import { SiweMessage } from "siwe";
import { observer } from "mobx-react-lite";
import { rootStore, RootStore } from "../stores/RootStore";

const authenticationAdapter = createAuthenticationAdapter({
    getNonce: async () => {
        const response = await fetch(`${settings.API_URL}/auth/nonce`, { credentials: "include" });
        return await response.text();
    },

    createMessage: ({ nonce, address, chainId }) => {
        const date = new Date();
        date.setDate(date.getDate() + 30);
        return new SiweMessage({
            domain: document.location.host,
            address,
            chainId: chainId,
            uri: document.location.origin,
            version: "1",
            statement: "Legend Maps",
            nonce,
            expirationTime: date.toISOString(),
        });
    },

    getMessageBody: ({ message }) => {
        //@ts-ignore
        return message.prepareMessage();
    },

    verify: async ({ message, signature }) => {
        const verifyRes = await fetch(`${settings.API_URL}/auth`, {
            //@ts-ignore
            body: JSON.stringify({ publicAddress: message.address, message: { ...message, signature } }),
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            method: "POST",
        });
        if (Boolean(verifyRes.ok)) {
            rootStore.accountStore.loadUser();
        }
        return Boolean(verifyRes.ok);
    },

    signOut: async () => {
        await fetch(`${settings.API_URL}/auth/logout`, {
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            method: "POST",
        });
    },
});

const Providers = observer(({ children, pageProps, rootStore }: any): JSX.Element => {
    const queryClientRef = useRef<any>(null);
    if (!queryClientRef.current) {
        queryClientRef.current = new QueryClient();
    }

    const { chains, provider } = configureChains(
        [chain.mainnet, chain.goerli],
        [infuraProvider({ apiKey: settings.INFURA_ID })],
    );

    const { connectors } = getDefaultWallets({
        appName: "LegendMaps",
        chains,
    });

    const wagmiClient = createClient({
        autoConnect: true,
        connectors,
        provider,
    });

    const { accountStore } = useContext(RootStoreContext);

    const authStatus = accountStore.loadingAccount
        ? "loading"
        : !accountStore.loadingAccount && !accountStore.isLoggedIn
        ? "unauthenticated"
        : "authenticated";

    return (
        <WagmiConfig client={wagmiClient}>
            <RainbowKitAuthenticationProvider adapter={authenticationAdapter} status={authStatus}>
                <RainbowKitProvider
                    showRecentTransactions={true}
                    chains={chains}
                    theme={darkTheme()}
                    initialChain={settings.TOKEN_CONTRACT_CHAIN_ID}
                >
                    <RootStoreContext.Provider value={rootStore}>
                        <ThemeProvider theme={theme}>
                            <QueryClientProvider client={queryClientRef.current}>
                                <AuthProvider>
                                    <SessionProvider>
                                        <Hydrate state={pageProps.dehydratedState}>{children}</Hydrate>
                                        <ReactQueryDevtools initialIsOpen={false} />
                                    </SessionProvider>
                                </AuthProvider>
                            </QueryClientProvider>
                        </ThemeProvider>
                    </RootStoreContext.Provider>
                </RainbowKitProvider>
            </RainbowKitAuthenticationProvider>
        </WagmiConfig>
    );
});

export default Providers;
