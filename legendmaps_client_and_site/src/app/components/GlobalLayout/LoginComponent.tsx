import {observer} from "mobx-react-lite";
import {useAuth} from "../../hooks/useAuth";
import {useState} from "react";

const LoginComponent = observer((): JSX.Element => {
    const [loggingIn, setLoggingIn] = useState<boolean>(false);

    const {user, isLoading, login} = useAuth();

    return (
        <>
            {!user && (
                <>
                    <p>Legend Maps Beta is live! Adventurer NFT holders and those with NFTs from our "Visiting
                        Adventurer" collections can play now – just sign in using the "Connect Wallet" button at the top
                        right.</p>
                </>
            )}
        </>
    );
});

export default LoginComponent;
