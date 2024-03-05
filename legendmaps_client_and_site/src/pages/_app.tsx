import {NextPage} from "next";
import {AppProps} from "next/app";
import Providers from "../util/Providers";
import Layout from "../app/components/GlobalLayout/layout";
import Head from "next/head";
import settings from "../settings";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {useEffect} from "react";
import {useRouter} from "next/dist/client/router";
import queryString from "query-string";
import Cookies from "js-cookie";
import {USER_COOKIES} from "../constants/userValues";
import {getDiscordToken} from "../util/auth";
import {rootStore} from "../stores/RootStore";
import {DwellerD} from "../constants/dwellerConstants";
import {ErrorBoundary} from "react-error-boundary";

const projectIdNameMap = {
    frwc: "Forgotten Runes Wizard's Cult",
    cryptocoven: "Crypto Coven",
    gawds: "Gawds",
    def: "Definitely Crypto",
    fwb: "Friends With Benefits",
};

type CustomPage = NextPage & {
    isMapsPage?: boolean;
    mapName?: string;
    mapImage?: string;
};

interface CustomAppProps extends Omit<AppProps, "Component"> {
    Component: CustomPage;
}

const App = ({Component, pageProps}: CustomAppProps): JSX.Element => {
    const router = useRouter();
    rootStore.loadInit();
    useEffect(() => {
        const pathStr = router.asPath.substring(8);
        const parsed = queryString.parse(pathStr);
        const cachedState = Cookies.get(USER_COOKIES.DISCORD_STATE);
        if (parsed?.code && parsed?.state && cachedState === parsed?.state) {
            getDiscordToken(parsed.code as string)
                .then((data) => {
                    router.push("/verify");
                })
                .catch((e) => {
                    console.error(e);
                });
        } else if (parsed?.code || parsed?.state) {
            console.error("Missing required discord auth paramaters");
        }
    }, []);
    const adventurerMeta = pageProps.adventurerData;
    const mapMeta = pageProps.mapJson;
    const projectId = pageProps.projectId;
    const dweller: DwellerD | undefined = pageProps.dweller;

    return (
        <>
            <Head>
                {mapMeta?.image ? (
                    <>
                        <meta property="og:title" content={mapMeta.name} key="og-title"/>
                        <meta
                            property="og:image"
                            content={`${settings.IMAGE_URL}${mapMeta?.image?.substring(7).split('/')[1]}`}
                            key="og-image"
                        />
                        <meta property="og:url" content={""} key="og-url"/>

                        <title>Legends Maps: {mapMeta.name}</title>
                    </>
                ) : projectId ? (
                    <>
                        <meta
                            property="og:title"
                            content={`Legends Maps: Claim ${projectIdNameMap[projectId]} Allowlist Spot`}
                            key="og-title"
                        />
                        <meta
                            property="og:image"
                            content={`${settings.APP_URL}/images/share/${projectId}.png`}
                            key="og-image"
                        />
                        <meta property="og:url" content={""} key="og-url"/>

                        <title>Legends Maps: Claim {projectIdNameMap[projectId]} Allowlist Spot</title>
                    </>
                ) : adventurerMeta ? (
                    <>
                        <meta property="og:title" content={adventurerMeta.name} key="og-title"/>
                        <meta
                            property="og:image"
                            content={`${settings.S3_URL}adv/p250/portrait_${adventurerMeta.tokenId}.png`}
                            key="og-image"
                        />
                        <meta property="og:url" content={""} key="og-url"/>

                        <title>{adventurerMeta.name}</title>
                    </>
                ) : dweller ? (
                    <>
                        <meta property="og:title" content={dweller.name} key="og-title"/>
                        <meta
                            property="og:image"
                            content={`${settings.APP_URL}/images/dw_${dweller.id}.png`}
                            key="og-image"
                        />
                        <meta property="og:url" content={""} key="og-url"/>

                        <title>{dweller.name}</title>
                    </>
                ) : (
                    <>
                        <meta
                            property="og:title"
                            content="Legends Maps: Roguelike Game and NFT Project"
                            key="og-title"
                        />
                        <meta
                            property="og:image"
                            content={`${settings.APP_URL}/images/share/legendmaps.png`}
                            key="og-image"
                        />
                        <meta property="og:url" content={""} key="og-url"/>

                        <title>Legends Maps: Roguelike Game and NFT Project</title>
                    </>
                )}

                <meta property="og:type" content="website" key="og-type"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>

                <meta
                    property="description"
                    content="Legend Maps is a roguelike dungeon crawler using NFTs on the ethereum blockchain. An opportunity for adventurers to seek fame, power and fortune by staking their claim to maps of infinite
        dungeons. Founder Maps NFT drop provides whitelist access to future Adventurer PFP and early gameplay."
                    key="og-description"
                />
                <meta property="twitter:card" content="summary_large_image" key="og-twitter-card"/>
                <meta property="twitter:site" content="@legend_maps" key="og-twitter-site"/>
            </Head>
            <Providers pageProps={pageProps} rootStore={rootStore}>
                <ErrorBoundary
                    fallbackRender={({error, resetErrorBoundary}) => (
                        <div role="alert">
                            <div>Oh no</div>
                            <pre>{error.message}</pre>
                            <div>Please report this error to the team. Refresh the page to try again</div>
                        </div>
                    )}
                >
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                </ErrorBoundary>
            </Providers>
        </>
    );
};

export default App;
