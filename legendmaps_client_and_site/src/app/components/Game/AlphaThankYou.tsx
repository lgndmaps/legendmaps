import {observer} from "mobx-react-lite";
import styled from "styled-components";
import {useRootStore} from "../../../store";
import Title from "../ui/Title";
import {css} from "@emotion/react";
import Button from "../ui/Button";

export const AlphaThankYou = observer(() => {
    const {
        accountStore: {
            user,
            featureFlags: {devMode},
        },
        gameStore: {playAgain},
    } = useRootStore();

    return (
        <div
            css={css`
              padding: 40px;
            `}
        >
            <Title text="Thanks for playing!"/>
            <DetailsWrapper>
                <p>
                    Thank you for playing the Legend Maps Beta! You can provide feedback and bug reports on our <a
                    href={"https://discord.com/invite/uGJ7CkR4XY"}>discord</a>.
                </p>
                <br/> <br/>
                <Button
                    onClick={() => {
                        playAgain();
                    }}
                >
                    Start New Campaign
                </Button>
            </DetailsWrapper>
        </div>
    );
});

const DetailsWrapper = styled.div``;
