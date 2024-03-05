import { observer } from "mobx-react-lite";
import { useContext, useState } from "react";
import styled from "styled-components";
import { StyledPageContainer } from "../../app/components/GlobalLayout/layout";
import Title from "../../app/components/ui/Title";
import { css } from "@emotion/react";
import Button from "../../app/components/ui/Button";
import { DWELLERS_INFO, Phylums } from "../../constants/dwellerConstants";
import { breakpoints } from "../../styles/styleUtils";
import { RootStoreContext } from "../../stores/with-root-store";
import { useRouter } from "next/router";
import Link from "next/link";

const Index = observer((): JSX.Element => {
    const { accountStore } = useContext(RootStoreContext);
    const router = useRouter();

    return (
        <StyledPageContainer>
            <Title text="Dwellers Compendium" />
            <div
                css={css`
                    padding: 20px 0;
                    display: flex;
                    align-items: center;
                    a {
                        text-decoration: none !important;
                    }
                `}
            >
                <h2>Index</h2>

                <a
                    css={css`
                        margin-left: auto;
                    `}
                    href="/dwellers/introduction"
                >
                    Introduction
                </a>
            </div>
            <IndexView>
                <div className="frame">
                    <img className="top-left corner-border" src="/images/border-corner.png" alt="" />
                    <img className="top-right corner-border" src="/images/border-corner.png" alt="" />
                    <img className="bottom-left corner-border" src="/images/border-corner.png" alt="" />
                    <img className="bottom-right corner-border" src="/images/border-corner.png" alt="" />
                </div>
                <Tabs>
                    <div
                        className={`tab ${accountStore.activeDwellerFilter === "full" ? "active" : ""}`}
                        onClick={() => {
                            accountStore.activeDwellerFilter = "full";
                        }}
                    >
                        A-Z
                    </div>
                    <div
                        className={`tab ${accountStore.activeDwellerFilter === "phylum" ? "active" : ""}`}
                        onClick={() => {
                            accountStore.activeDwellerFilter = "phylum";
                        }}
                    >
                        Types
                    </div>
                </Tabs>
                {accountStore.activeDwellerFilter === "full" && (
                    <FullView
                        css={css`
                            padding: 60px 40px;
                        `}
                    >
                        <div
                            className="border-cover"
                            css={css`
                                position: absolute;
                                width: calc(100% - 78px);
                                height: calc(100% - 118px);
                                border: 2px solid #000;
                                z-index: 3;
                                pointer-events: none;
                            `}
                        />
                        {DWELLERS_INFO.map((dweller) => {
                            return (
                                <Dweller
                                    href={`/dwellers/${dweller.id}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        router.push(`/dwellers/${dweller.id}`);
                                    }}
                                >
                                    <img src={`/images/dw_${dweller.id}.png`} alt={dweller.name} />
                                    <p>{dweller.name}</p>
                                </Dweller>
                            );
                        })}
                    </FullView>
                )}
                {accountStore.activeDwellerFilter === "phylum" && (
                    <PhylumView
                        css={css`
                            padding: 60px 40px;
                        `}
                    >
                        {Phylums.map((phylum) => {
                            return (
                                <>
                                    <div
                                        className="phylum-title"
                                        css={css`
                                            margin-top: 25px;
                                            position: relative;
                                            z-index: 2;
                                        `}
                                    >
                                        <h2>{phylum}</h2>
                                    </div>
                                    <FullView
                                        css={css`
                                            position: relative;
                                        `}
                                    >
                                        <div
                                            className="border-cover"
                                            css={css`
                                                position: absolute;
                                                width: calc(100% + 2px);
                                                height: calc(100% + 2px);
                                                border: 2px solid #000;
                                                z-index: 3;
                                                pointer-events: none;
                                            `}
                                        />
                                        {DWELLERS_INFO.filter((dweller) => dweller.phylum === phylum).map((dweller) => {
                                            return (
                                                <Dweller
                                                    href={`/dwellers/${dweller.id}`}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        router.push(`/dwellers/${dweller.id}`);
                                                    }}
                                                >
                                                    <img src={`/images/dw_${dweller.id}.png`} alt={dweller.name} />
                                                    <p>{dweller.name}</p>
                                                </Dweller>
                                            );
                                        })}
                                    </FullView>
                                </>
                            );
                        })}
                    </PhylumView>
                )}
            </IndexView>
        </StyledPageContainer>
    );
});

const IndexView = styled.div`
    position: relative;
    margin-top: 30px;
    &:before {
        content: "";
        display: block;
        width: 97%;
        position: absolute;
        height: 3px;
        left: 0;
        top: 12px;
        background: #868686;
        z-index: -1;
    }
    &:after {
        content: "";
        display: block;
        width: 97%;
        position: absolute;
        height: 3px;
        right: 0;
        bottom: 38px;
        background: #868686;
        z-index: -1;
    }
    .frame {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        &:before {
            content: "";
            display: block;
            height: 97%;
            position: absolute;
            width: 3px;
            left: 12px;
            top: 0;
            background: #868686;
            z-index: -1;
        }
        &:after {
            content: "";
            display: block;
            height: 97%;
            position: absolute;
            width: 3px;
            right: 12px;
            top: 0;
            background: #868686;
            z-index: -1;
        }
        .corner-border {
            position: absolute;
            bottom: 0;
            right: 0;
            background: #000;
            z-index: 1;
            &.top-left {
                top: 0;
                left: 0;
                transform: rotate(-180deg);
            }
            &.top-right {
                top: 0;
                right: 0;
                transform: rotate(-90deg);
            }

            &.bottom-right {
                bottom: 0;
                left: 0;
                transform: rotate(90deg);
            }
        }
    }
`;

const Tabs = styled.div`
    position: absolute;
    z-index: 2;
    left: 50%;
    transform: translateX(-50%);
    top: -25px;
    display: flex;

    .tab {
        cursor: pointer;
        width: 150px;
        height: 40px;
        border: 2px solid #858585;
        border-bottom: 2px solid #858585;
        background: #858585;
        padding: 5px 10px;
        text-align: center;
        margin: 0 10px;
        @media (max-width: ${breakpoints.mobile}) {
            width: 75px;
        }
        &.active {
            background: #000;
            border-bottom: 2px solid transparent;
        }
    }
`;

const Dweller = styled.a`
    cursor: pointer;
    position: relative;
    z-index: 2;
    width: calc(25% - 2px);
    padding: 15px;
    display: flex;
    align-items: center;
    cursor: pointer;
    text-decoration: none;

    outline: 2px dashed #707070;
    margin-top: 2px;
    margin-left: 2px;

    @media (max-width: ${breakpoints.tablet}) {
        width: calc(33.3333% - 2px);
    }
    @media (max-width: ${breakpoints.mobile}) {
        width: calc(50% - 2px);
    }
    @media (max-width: ${breakpoints.mobileMid}) {
        width: calc(100% - 2px);
    }
    &:hover {
        outline: 2px dashed #707070 !important;
    }
    img {
        width: 35px;
        height: 35px;
        margin-right: 15px;
        display: block;
        margin-bottom: 0;
    }
`;

const FullView = styled.div`
    display: flex;
    flex-wrap: wrap;
`;

const PhylumView = styled.div``;
export default Index;
