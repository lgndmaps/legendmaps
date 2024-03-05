import {useContext, useEffect} from "react";
import {RootStoreContext} from "../../../stores/with-root-store";
import {css} from "@emotion/react";
import {powerups} from "../../../assets/data/powerups";
import {StyledPageContainer} from "../GlobalLayout/layout";
import {observer} from "mobx-react-lite";

export const PowerupSelect = observer(() => {
    const {accountStore, gameStore} = useContext(RootStoreContext);

    useEffect(() => {
        gameStore.selectedPowerup = null;
    }, []);

    if (!accountStore.hasPowerups) {
        return <></>;
    }

    return (
        <StyledPageContainer>
            <div
                css={css`
                  display: flex;
                  margin-top: 30px;
                `}
            >
                {powerups.map((p) => {
                    const puBalance = accountStore.powerupsBalances.get(p.id);
                    if (!puBalance) {
                        return null;
                    }

                    return (
                        <div
                            css={css`
                              display: flex;
                              flex-direction: column;
                              cursor: pointer;
                              margin: 10px;
                              padding: 10px;
                              border: 2px solid ${gameStore.selectedPowerup === p.id ? "#d0b05c" : "#fff"};
                            `}
                            onClick={() => {
                                gameStore.selectedPowerup = gameStore.selectedPowerup === p.id ? null : p.id;
                            }}
                        >
                            <div>{p.name}</div>

                        </div>
                    );
                })}
            </div>
        </StyledPageContainer>
    );
});
