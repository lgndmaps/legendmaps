import * as React from "react";
import { v4 as uuidv4 } from "uuid";
import Cookies from "js-cookie";
import { css } from "@emotion/react";

import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useRootStore } from "../../../store";
import { useDiscordQuery } from "../../hooks/useSessionQuery";
import { discordLogout, getUserGuilds, logout, startAuth, verifyDiscord } from "../../../util/auth";
import styled from "styled-components";
import Button from "../ui/Button";
import { USER_COOKIES } from "../../../constants/userValues";
import settings from "../../../settings";

import { useQueryClient } from "react-query";
import { useAuth } from "../../hooks/useAuth";
import { getProvider } from "../../hooks/useProvider";
import { getDisplayName } from "../../../util/user";
import { RootStoreContext } from "../../../stores/with-root-store";
const DiscordVerifyWrapper = styled.div`
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    & > * {
        margin-bottom: 20px;
    }

    .spacer {
        display: block;
        width: 100%;
        margin-bottom: 30px;
    }

    .success {
        color: green;
    }

    .error {
        color: red;
    }
`;

const DiscordVerifyView = observer(() => {
    const [hasMaps, setHasMaps] = useState<boolean>(false);
    const [hasAdventurers, setHasAdventurers] = useState<boolean>(false);

    const [loggingIn, setLoggingIn] = useState<boolean>(false);
    const [loadingMaps, setLoadingMaps] = useState<boolean>(false);
    const [loadingAdventurers, setLoadingAdventurers] = useState<boolean>(false);

    const {
        adventurersStore,
        mapsStore: mapsContractStore,
        accountStore,
        adventurersContractStore,
    } = React.useContext(RootStoreContext);

    const walletConnected = accountStore.user;
    const queryClient = useQueryClient();
    const { data: discordUser } = useDiscordQuery();
    const { user, loadingAccount: isLoading, login } = accountStore;
    const [isVerifying, setIsVerifying] = useState<boolean>(false);
    const [showSuccess, setShowSuccess] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const getHasMaps = async () => {
        setLoadingMaps(true);
        if (user?.publicAddress) {
            await mapsContractStore.loadUserMaps();
            const length = mapsContractStore.userMaps.length;
            setHasMaps(length > 0);
        } else {
            setHasMaps(false);
        }
        setLoadingMaps(false);
    };

    const getHasAdventurers = async () => {
        setLoadingAdventurers(true);
        if (user?.publicAddress) {
            await adventurersStore.loadUserAdventurers();
            const length = adventurersStore.userAdventurers?.length || 0;
            setHasAdventurers(length > 0);
        } else {
            setHasAdventurers(false);
        }
        setLoadingAdventurers(false);
    };

    useEffect(() => {
        getHasMaps();
        getHasAdventurers();
    }, [user]);

    const handleAuth = () => {
        const uuid = uuidv4();

        Cookies.set(USER_COOKIES.DISCORD_STATE, uuid);
        window.open(
            `https://discord.com/api/oauth2/authorize?client_id=916115364310581318&redirect_uri=${encodeURIComponent(
                settings.DISCORD_REDIRECT_URL,
            )}&state=${encodeURIComponent(uuid)}&response_type=code&scope=identify%20guilds`,
            "_self",
        );
    };

    return (
        <DiscordVerifyWrapper>
            <h1>Verify Discord Account</h1>

            {(isLoading || loadingMaps || loadingAdventurers) && <>Loading...</>}

            {!isLoading && !loadingMaps && !loadingAdventurers && (
                <>
                    {!discordUser && !user?.publicAddress ? (
                        <div>Login to discord and Legend Maps to verify your account</div>
                    ) : !discordUser ? (
                        <div>Login to discord to verify your account</div>
                    ) : (
                        !user?.publicAddress && <div>Connect your wallet and login to verify your account</div>
                    )}

                    {!discordUser && <Button onClick={handleAuth}>Discord Login</Button>}

                    {discordUser && (
                        <>
                            <div>
                                Logged in to discord as {discordUser.username}#{discordUser.discriminator}. Once
                                verified, you can safely logout of discord
                            </div>
                            <Button
                                onClick={() => {
                                    discordLogout(queryClient);
                                }}
                            >
                                Logout of Discord
                            </Button>
                        </>
                    )}

                    <div className="spacer"></div>

                    {!user && !walletConnected && <>Connect your wallet to login to Legend Maps</>}

                    {user?.publicAddress && (
                        <div>
                            <>Logged into Legend Maps as {getDisplayName(user)}</>
                            <br />

                            {(hasMaps || hasAdventurers) && (
                                <div
                                    css={css`
                                        margin-top: 15px;
                                    `}
                                >
                                    You hold{" "}
                                    {hasMaps && hasAdventurers
                                        ? "maps and adventurers"
                                        : hasMaps
                                        ? "maps"
                                        : hasAdventurers
                                        ? "adventurers"
                                        : ""}
                                </div>
                            )}
                        </div>
                    )}

                    {user && !hasMaps && !hasAdventurers && (
                        <div>
                            <>The connected account does not own any maps or adventurers</>
                        </div>
                    )}

                    {discordUser && user?.publicAddress && (hasMaps || hasAdventurers) && (
                        <Button
                            disabled={isVerifying || showSuccess}
                            onClick={async () => {
                                setIsVerifying(true);
                                const response = await verifyDiscord(discordUser.id, user.id);
                                if (response?.discordId) {
                                    setShowSuccess(true);
                                } else {
                                    setError("Could not update your discord role");
                                }
                                setIsVerifying(false);
                            }}
                        >
                            {isVerifying ? "Verifying Account" : showSuccess ? "Verified" : "Verify Discord Account"}
                        </Button>
                    )}
                    {showSuccess && <div className="success">{"Roles added"}</div>}
                    {error && <div className="error">{error}</div>}
                </>
            )}
        </DiscordVerifyWrapper>
    );
});

export default DiscordVerifyView;
