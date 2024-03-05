import LandingCarousel from "./LandingCarousel";
import Image from "next/image";
import styled from "styled-components";
import { css } from "@emotion/css";
import Wiz from "../../assets/images/wiz.png";
import Rat from "../../assets/images/rat_2.png";
import MapsFlip from "../../assets/images/mapsflip.gif";
import AdvsFlip from "../../assets/images/advs2.gif";
import { StyledPageContainer } from "../components/GlobalLayout/layout";
import { breakpoints } from "../../styles/styleUtils";
import Link from "next/dist/client/link";
import Button from "../components/ui/Button";
import FeatureItem from "../components/FeatureItem";

const StyledLanding = styled.div`
  .centered {
    align-self: center;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    justify-content: center;
  }

  .border-image {
    border: 0px #111 solid;
  }

  .margin-image {
    margin-bottom: 0.1rem;
    margin-top: 1rem;
    margin-left: auto;
    margin-right: auto;
  }

`;

const Landing = () => {
  return (
    <StyledPageContainer>
      <StyledLanding>


        <div
          css={css`
                      display: flex;
                      justify-content: space-between;
                      @media (max-width: ${breakpoints.tablet}) {
                        flex-wrap: wrap;
                      }
                    `}
        >
          <div
            css={css`
                          width: calc(75%);
                          @media (max-width: ${breakpoints.tablet}) {
                            width: 100%;
                            margin-bottom: 10px;
                          }
                        `}
          >
            <LandingCarousel />
          </div>
          <div
            css={css`
                          width: calc(25%);
                          @media (max-width: ${breakpoints.tablet}) {
                            width: 100%;
                          }
                        `}
          >
            <div
              css={css`
                              padding: 18px;
                              border: 1px solid #d6b04b;
                              height: 100%;
                              display: flex;
                              flex-direction: column;
                            `}
            >
              <h1
                css={css`
                                  font-size: 22px;
                                  color: #d6b04b;
                                `}
              >
                Legend Maps Beta is live.


                <span
                  css={css`
                                      color: #ffffff;
                                    `}
                >
                  <br />Play now!
                </span>
              </h1>
              <h3
                css={css`
                                  display: block;
                                  margin-top: 65px;
                                  font-size: 16px;
                                  margin-bottom: 10px;
                                  font-weight: normal;
                                `}
              >
                Adventurer NFT holders and those with NFTs from our "Visiting Adventurer" collections
                can join the beta test now.
              </h3>
              <Link href={"/game/"}>
                <Button
                  css={css`
                                      display: block;
                                      margin-top: auto;
                                      margin-left: auto;
                                    `}
                >
                  Play Legend Maps
                </Button>
              </Link>
            </div>
          </div>
        </div>


        <br />


        <FeatureItem title={"What is Legend Maps?"}
          contents={" Legend Maps is an old school roguelike dungeon crawler at heart, with NFTs providing an additional layer of meta-gameplay. True to the genre, it’s a turn-based hack-and-slash game with procedurally-generated experiences for an endless variety of play. But instead of just randomly rolling a character, Adventurer NFTs become the characters players use to explore dungeons, and the dungeons themselves are generated based on Founder Map NFTs. Holders of both NFTs earn rewards when the game is played"} />


        <span
          style={{ float: "right", border: "1px solid #666", marginLeft: "1rem", marginBottom: "1rem" }}><Image
            src={MapsFlip}
            width={350}
            height={350}

            alt={"maps"} /></span>
        <span style={{ width: "50%", display: "inline" }}>
          <FeatureItem title={"Maps"}

            contents={" Our first NFTs, the limited edition Founder Maps are the gateways to unique & unexplored dungeons. Each map is the keystone to a claim, establishing the dungeon's name, biome, and critically, the nasty creatures who dwell there and the loot an intrepid adventurer might find. Since map holders earn rewards every time an adventurer enters their map, and even more when they die, owning a map that is both desirable *and* deadly is a winning combination. Ever wished you were a dungeon landlord? Your time has come! Founders Maps NFTs were minted in November 2021."} />
        </span>

        <p style={{ clear: "both" }} />

        <span
          style={{ float: "left", border: "1px solid #666", marginRight: "2rem", marginBottom: "1rem" }}><Image
            src={AdvsFlip}
            width={251}
            height={250}

            alt={"maps"} /></span>
        <FeatureItem title={"Adventurers."}
          contents={" Adventurers represent the brave (or foolhardy!) souls that dare plumb the depths for glory and plunder.  Each Adventurer has a unique combination of traits & abilities, catering to a variety of playstyles. Adventurer NFTs were minted in April 2022."} />

        <FeatureItem title={"Replayable Worlds."}
          contents={" Legend Maps games are procedurally generated, resulting in endless varieties of rooms, monsters, gear & treasures. In true roguelike fashion each run will bear new dangers & rewards – one run may be filled with woe & a few coppers, the next could offer fabulous jewels or rare magicks."} />


        <FeatureItem title={"You are the Map & the Explorer!"}
          contents={" Not only will you explore & plunder your maps, other Legend Maps players will too. When other players enter your dungeon you earn rewards, especially when they die ☠️! Rare & spicy high risk/reward maps will lure the most ambitious players & generate the biggest gains."} />

        <Image src={Rat} width={369} height={283} alt={"rat"} />
        <div
          style={{
            padding: "0rem",
            display: "flex",
            alignContent: "center",
          }}
        >
          <div style={{ marginLeft: `auto`, marginRight: `auto` }}>
            ...
          </div>
        </div>
        <span style={{ width: "100%", display: "flex" }}>
          <div className="image-wrapper centered margin-image">
            <Image src={Wiz} width={450} quality={95} alt="roadmap" />
          </div>
        </span>
      </StyledLanding>
    </StyledPageContainer>
  );
};

export default Landing;
