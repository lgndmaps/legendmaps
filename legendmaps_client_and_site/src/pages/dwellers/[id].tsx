import { observer } from "mobx-react-lite";
import { StyledPageContainer } from "../../app/components/GlobalLayout/layout";
import Button from "../../app/components/ui/Button";
import Title from "../../app/components/ui/Title";
import { DwellerD, DWELLERS_INFO } from "../../constants/dwellerConstants";
import { css } from "@emotion/react";
import styled from "styled-components";
import { breakpoints } from "../../styles/styleUtils";
import { CompendiumBorder } from "../../app/components/ui/CompendiumBorder";
import { DwellerPortrait } from "../../app/components/ui/DwellerPortrait";
import { useRouter } from "next/router";

export interface IDwellerServerProps {
    dweller?: DwellerD;
    dwellerId?: string;
    index?: number;
    notFound?: boolean;
}
const Index = observer(({ dweller, dwellerId, index, notFound }: IDwellerServerProps): JSX.Element => {
    if (notFound || !dweller) {
        return <>No dweller found for ID {dwellerId}</>;
    }
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
                    @media (max-width: ${breakpoints.mobile}) {
                        flex-wrap: wrap;
                        justify-content: center;
                    }
                `}
            >
                <h2
                    css={css`
                        @media (max-width: ${breakpoints.mobile}) {
                            width: 100%;
                            text-align: center;
                        }
                    `}
                >
                    {dweller.name}
                </h2>
                <div
                    css={css`
                        margin-left: auto;
                        cursor: pointer;
                        @media (max-width: ${breakpoints.mobile}) {
                            margin-left: initial;
                        }
                    `}
                >
                    <a
                        href="/dwellers"
                        onClick={(e) => {
                            e.preventDefault();
                            router.push(`/dwellers`);
                        }}
                    >
                        <Button>Index</Button>
                    </a>
                </div>
                <a
                    css={css`
                        margin-left: 10px;
                    `}
                    href="/dwellers/introduction"
                    onClick={(e) => {
                        e.preventDefault();
                        router.push(`/dwellers/introduction`);
                    }}
                >
                    Introduction
                </a>
            </div>
            <DwellerContent>
                <DwellerImage>
                    <div className="frame">
                        <img className="top-left corner-border" src="/images/border-corner.png" alt="" />
                        <img className="top-right corner-border" src="/images/border-corner.png" alt="" />
                        <img className="bottom-left corner-border" src="/images/border-corner.png" alt="" />
                        <img className="bottom-right corner-border" src="/images/border-corner.png" alt="" />
                    </div>
                    <div css={css``}>
                        <div className="dweller-image">
                            <img src={`/images/dw_${dweller.id}.png`} alt={dweller.name} />
                        </div>
                        <div className="phylum stat">
                            <strong>Phylum:</strong> {dweller.phylum.toLowerCase()}
                        </div>
                        <div className="size stat">
                            <strong>Size:</strong> {dweller.size}
                        </div>
                        <div className="frequency stat">
                            <strong>Frequency:</strong> {dweller.frequency}
                        </div>
                        <div className="num stat">
                            <strong>No. Appearing:</strong> {dweller.num}
                        </div>
                        <div className="resistances stat">
                            <strong></strong> <br />▪{dweller.resistances}
                            {dweller.abilities !== "" ? (
                                <span>
                                    <br />▪{dweller.abilities}
                                </span>
                            ) : (
                                ""
                            )}
                        </div>
                    </div>
                </DwellerImage>
                <DwellerDescription>
                    <CompendiumBorder />
                    <div
                        css={css`
                            align-items: center;
                            justify-content: center;
                        `}
                    >
                        <DwellerPortrait id={dweller.id} name={dweller.name} />

                        {dweller.description}
                    </div>
                    <CompendiumBorder />
                </DwellerDescription>
            </DwellerContent>
            <DwellerNavigation>
                {index !== 0 && (
                    <a className="prev" href={`/dwellers/${DWELLERS_INFO[index - 1].id}`}>{`< ${
                        DWELLERS_INFO[index - 1].name
                    }`}</a>
                )}
                {index !== DWELLERS_INFO.length - 1 && (
                    <a className="next" href={`/dwellers/${DWELLERS_INFO[index + 1].id}`}>{`${
                        DWELLERS_INFO[index + 1].name
                    } >`}</a>
                )}
            </DwellerNavigation>
        </StyledPageContainer>
    );
});

const DwellerContent = styled.div`
    display: flex;
    @media (max-width: ${breakpoints.tablet}) {
        flex-wrap: wrap;
    }
`;

const DwellerImage = styled.div`
    width: 300px;
    margin-right: 40px;

    display: flex;
    flex-direction: column;
    justify-content: start;

    position: relative;
    padding: 60px 32px;
    font-size: 16px;

    ul {
        padding: 10px 0 0 20px;
        margin: 0;
        list-style-type: square;
    }

    li {
        padding: 0;
        margin: 0;
    }

    strong {
        color: #fff;
    }

    @media (max-width: ${breakpoints.tabletSmall}) {
        margin: 0 auto;
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
            height: 90%;
            position: absolute;
            width: 3px;
            left: 12px;
            top: 0;
            background: #868686;
        }
        &:after {
            content: "";
            display: block;
            height: 90%;
            position: absolute;
            width: 3px;
            right: 12px;
            top: 0;
            background: #868686;
        }
        .corner-border {
            position: absolute;
            bottom: 0;
            right: 0;
            background: #000;
            z-index: 1;
            margin-bottom: 0 !important;
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

    .dweller-image {
        width: 160px;
        height: 160px;
        margin: 0 auto;
        margin-bottom: 15px;
        position: relative;
        z-index: 2;
        img {
            display: block;
            height: 100%;
            width: auto;
            margin: 0 auto;
        }
    }
    img {
        image-rendering: pixelated;
    }
    .stat {
        line-height: 1.2;
        position: relative;
        color: #ccc;
        z-index: 2;
    }
`;

const DwellerDescription = styled.div`
    flex: 1;
    min-height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    @media (max-width: ${breakpoints.tabletSmall}) {
        width: 100%;
        flex: initial;
        margin-top: 15px;
    }
`;

const DwellerNavigation = styled.div`
    padding: 20px 0;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    .prev {
        margin-right: 20px;
    }
    a {
        text-decoration: none !important;
    }
`;

export const getServerSideProps = async (ctx) => {
    const { id } = ctx.params;
    const dwellerIdx = DWELLERS_INFO.findIndex((d) => d.id === id);
    let dweller = {};
    if (dwellerIdx === -1) {
        dweller = { notFound: true };
    } else {
        dweller = { dweller: DWELLERS_INFO[dwellerIdx], index: dwellerIdx, dwellerId: id };
    }

    return { props: { ...dweller } };
};

export default Index;
