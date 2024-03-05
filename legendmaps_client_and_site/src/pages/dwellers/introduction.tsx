import { observer } from "mobx-react-lite";
import styled from "styled-components";
import { StyledPageContainer } from "../../app/components/GlobalLayout/layout";
import Title from "../../app/components/ui/Title";
import { css } from "@emotion/react";
import Button from "../../app/components/ui/Button";
import { CompendiumBorder } from "../../app/components/ui/CompendiumBorder";

const Index = observer((): JSX.Element => {
    return (
        <StyledPageContainer>
            <Title text="Dwellers Compendium" />
            <div
                css={css`
                    padding: 20px 0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    a {
                        text-decoration: none !important;
                    }
                `}
            >
                <h2>Introduction</h2>
                <a href="/dwellers">
                    <Button>Index</Button>
                </a>
            </div>
            <div
                css={css`
                    margin: 20px 0;
                `}
            >
                <CompendiumBorder />
            </div>{" "}
            <h2
                css={css`
                    margin: 20px 0;
                `}
            >
                A GUIDE TO THE BEASTS, SPIRITS, DEMONS AND VARIOUS ARCANA OF YENDOR, JALENHORM, ONEIRIA AND THEIR
                SURROUNDING LANDS
            </h2>
            <h4
                css={css`
                    margin: 20px 0;
                `}
            >
                A Tome of Scientific and Magical Significance by the Wizard Thagorast
            </h4>
            <DwellersIntro>
                <IntroBorder />
                <IntroContent>
                    <img src="/images/compendium-i.png" />
                    f you are perusing this hefty, gilded and leather-bound volume, three things may be presumed about
                    you. First: you can read, which - congratulations! You are already amongst the highest echelons of
                    the educated elite! You must be either a noble, a scholar, or a lowborn without ready access to
                    friends or outdoor activities. Second: you, like so many others before you, have developed a keen
                    taste for that most intoxicating of elixirs: ADVENTURE. And third: armed as you are with
                    intelligence and a yearning for exploration, you wish not to be immediately slain by the first
                    kobold or ill-tempered wood sprite that crosses your path.
                    <br />
                    <br /> Well, fear not, brave adventurer, for I, Thagorast the Wizard (of the Annointed Esterloch
                    Council, Defender of the Ancient Athaeneum of Thrond, and High Champion of the Sapphire Spire eight
                    years running, no big deal) have spent much of the last two centuries traveling these lands,
                    meticulously compiling the bestiary you now hold in your hands. I have devoted my life to observing,
                    cataloguing, and, yes, alright, DISPATCHING all manner of living and unliving creatures in these
                    lands: from the rocky shores of Tattersail to the highest peaks of Devilscar, from the obsidian
                    caverns of the Nine Fingers to the fetid sewers of Spectral City (my review: skip them).
                    <br />
                    <br />
                    Upon these pages you shall find inscribed the names, habits and unique methods of attack and defense
                    practiced by each of these "Dwellers," as I like to call them. My hope is that each entry shall
                    provide you with the knowledge to face these creatures bravely and with a sound strategy in battle,
                    in those cases where the creature is near or below your strength and skill. For those creatures
                    stronger than yourself, let this guide serve as a detailed glimpse at the way you are likely to be
                    gruesomely murdered. As long as you do not attempt to read this book WHILST in battle (an
                    all-too-common blunder!), it should serve a very useful purpose.
                    <br />
                    <br />
                    And unlike OTHER TOMES of this kind (I'm looking at thee, BIDRICK THE FABULOUS - a self-bestowed
                    title, I ASSURE YOU), everything within this manual is TRUE, UNEMBELLISHED and VERIFIED by myself. I
                    do not outsource my adventuring as some authors do, sending wave after wave of pupils and
                    apprentices to their deaths while I sit in my sanctum and scrawl notes. (Of course I have
                    apprentices and of course many of them have died horribly, but at least I was FIGHTING BY THEIR SIDE
                    whilst they bravely CARRIED MY STUFF).
                    <br />
                    <br />
                    And with that I invite you to read on, and learn of these many fantastical Dwellers you are sure to
                    encounter on your path toward adventure, riches and renown. Tread with courage, vigilance,
                    curiosity, and above all else, purpose!
                </IntroContent>
            </DwellersIntro>
            <div
                css={css`
                    margin: 20px 0;
                `}
            >
                <CompendiumBorder />
            </div>
            <DwellersCTA>
                <a href="/dwellers">
                    <h2>{"Explore the Dwellers Index >"}</h2>
                </a>
            </DwellersCTA>
        </StyledPageContainer>
    );
});

const DwellersIntro = styled.div`
    display: flex;
    position: relative;
    a {
        text-decoration: none !important;
    }
`;
const IntroBorder = styled.div`
    display: block;
    width: 60px;
    margin-right: 20px;
    border: 3px solid #707070;
    height: 100%;
    position: absolute;
    height: calc(100% - 40px);
    left: 0;
    top: 0;
    background: url("/images/compendium-border.png");
    background-repeat: repeat-y;
    background-position: top center;
`;
const IntroContent = styled.div`
    img {
        float: left;
        padding-right: 10px;
        margin-bottom: 0 !important;
    }
    width: calc(100% - 80px);
    margin-left: 80px;
    margin-bottom: 40px;
`;
const DwellersCTA = styled.div`
    padding: 40px 0;
    a {
        text-decoration: none !important;
    }
`;
export default Index;
