import React from "react";
import { RightSideBar, StyledPageContainer } from "../app/components/GlobalLayout/layout";
import Title from "../app/components/ui/Title";
import Image from "next/image";
import Rat from "../assets/images/rat_2.png";
import AdvCarousel from "../app/components/Adventurers/AdventurerCarousel";
import styled from "styled-components";
import MintModule from "../app/components/AdventurersMint/MintModule";
const adventurers = () => {
    return (
        <StyledPageContainer>
            <Title text="Adventurers" />
            <MintModule />
            <h2>About Adventurers</h2>

            <p>
                Adventurers are the second NFT collection from Legend Maps, representing a rogue's gallery of playable
                characters ready to delve into the dungeons represented by the Founder Maps, vanquish the dwellers and
                other dangers within, and emerge victorious with the loot... or die trying! Each Adventurer will have
                unique combinations of traits &amp; abilities that will impact gameplay, and which are captured in the
                NFT metadata.
            </p>

            <p>
                <br />
            </p>
            <div>
                <AdvCarousel />
            </div>
            <p>
                <br />
            </p>
            <p>
                <br />
            </p>
            <p>
                <h2>B.A.G.S. Attributes</h2>
                Adventurers use an Attributes system we're calling B.A.G.S. - short for Brawn, Agility, Guile, and
                Spirit. Here's what they mean and (very broadly) how they work:
                <table>
                    <tr>
                        <td>
                            <b>Attribute</b>
                        </td>
                        <td>
                            <b>Description</b>
                        </td>
                        <td>
                            <b>Game Effects</b>
                        </td>
                    </tr>
                    <tr>
                        <td>Brawn</td>
                        <td>Raw physical strength &amp; fortitude </td>
                        <td>Melee damage, health points, physical defense, feats of strength.</td>
                    </tr>
                    <tr>
                        <td>Agility</td>
                        <td>Dexterity, speed &amp; finesse </td>
                        <td>Range damage, to hit, feats of dexterity.</td>
                    </tr>
                    <tr>
                        <td>Guile</td>
                        <td>Cleverness, savvy, social skills </td>
                        <td>Critical chance, luck, stealth, and story event bonuses.</td>
                    </tr>
                    <tr>
                        <td>Spirit</td>
                        <td>Magical power &amp; inner strength </td>
                        <td>Magical damage and to hit, mental resistance and will, health points.</td>
                    </tr>
                </table>
            </p>
            <p>
                <br />
            </p>
            <p>
                <h2>Traits</h2>
                Traits are intrinsic characteristics of an Adventurer, and they define some aspects of their background,
                personality, &amp; abilities.
                <br />
                <br />
                <b>What makes a good trait?</b>
                <div style={{ float: "right" }}>
                    <Image src={Rat} width={369} quality={100} alt="rat line art" />
                </div>
                <ul>
                    <li>
                        <b>Meaningful</b> Traits have a tangible impact on gameplay, not tiny marginal upgrades like "1%
                        resistance to cold."
                    </li>
                    <li>
                        <b>Personality</b> Traits give flavor and character to each Adventurer.
                    </li>
                    <li>
                        <b>Flexible</b> Traits do not restrict how an Adventurer can be played, no limitations like
                        "only fights with swords." We don't want traits dictating play-styles.
                    </li>
                    <li>
                        <b>Balanced</b> While some trade-offs add interest, every Adventurer should gain net benefits
                        from their traits.
                    </li>
                </ul>
                <b>Sample Traits</b>
                <br />
                Here are some traits we currently have in the mix (out of over 100 and counting), though all are subject
                to change!
                <ul>
                    <li>
                        <b>Eagle Eye:</b> Critical hit bonus with agility weapons.
                    </li>
                    <li>
                        <b>Safecracker:</b> Skilled at finding hidden compartments. Better gear from chests.
                    </li>
                    <li>
                        <b>Hunter:</b> An accomplished hunter. Attack bonus vs. beasts.
                    </li>
                    <li>
                        <b>Squire:</b> Start with an uncommon sword.
                    </li>
                    <li>
                        <b>Mountaineer:</b> Health bonus on mountain biome maps.
                    </li>
                    <li>
                        <b>Deceptive:</b> A skilled liar, bonus in some story events.
                    </li>
                    <li>
                        <b>Thick Skin:</b> Natural resistance to blade attacks
                    </li>
                    <li>
                        <b>Paranoid</b>: Beset by fears. Expert at spotting traps, but vulnerable to mental attacks.
                    </li>
                </ul>
                <h2>Image Formats</h2>
                A goal for Adventurers is that they're flexible &amp; portable for owners, and to that end we'll include
                multiple formats in the metadata/IPFS:
                <br />
                <br />
                <b>Square Portrait</b>
                <br />
                The square portrait image will be the one seen in NFT marketplaces, the default representation of the
                Adventurer.
                <br />
                <ImageWrapper>
                    <Image src={"/images/carousel/portrait_266.png"} width={600} height={600} quality={100} alt="adv" />
                </ImageWrapper>
                <p>
                    <br />
                </p>
                <b>Adventurer Card</b>
                <br />
                A card / character sheet which includes name, attributes, and traits. Useful for showing off
                adventurer's details and comparison browsing.
                <br />
                <ImageWrapper>
                    <Image
                        src={"/images/carousel/char_card_266.png"}
                        width={500}
                        height={550}
                        quality={100}
                        alt="adv"
                    />
                </ImageWrapper>
                <p>
                    <br />
                </p>
                <b>Transparent Portrait</b>
                <br />
                A transparent background version of the portrait, great for derivative art projects or dropping an
                Adventurer into different settings or worlds.
                <br />
                <ImageWrapper>
                    <Image
                        src={"/images/carousel/tp_portrait_266.png"}
                        width={600}
                        height={600}
                        quality={100}
                        alt="adv"
                    />
                </ImageWrapper>
            </p>
            <p>
                <br />
            </p>
        </StyledPageContainer>
    );
};

const ImageWrapper = styled.div`
    display: flex;
    justify-content: center;
    margin: 25px;
`;

export default adventurers;
