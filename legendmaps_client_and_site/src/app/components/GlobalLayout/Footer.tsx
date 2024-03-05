import React from "react";
import styled from "styled-components";
import Link from "next/link";
import DiscordIcon from "../../../assets/images/discord.png";
import TwitterIcon from "../../../assets/images/twitter.png";
import OpenseaIcon from "../../../assets/images/Opensea-Logomark-White.svg";
import EtherscanIcon from "../../../assets/images/etherscan-logo-white.png";
import LooksrareIcon from "../../../assets/images/looksrare-logo-white.png";
import Image from "next/image";
import { EXTERNAL_LINKS } from "../../../constants/externalLinks";
import ExternalLink from "../ExternalLink";
import MailchimpSubscribe from "react-mailchimp-subscribe";
import Button from "../ui/Button";
import { css } from "@emotion/react";
import { palette } from "../../../styles/styleUtils";
import { useRouter } from "next/router";
import { RootStoreContext } from "../../../stores/with-root-store";

export const footerHeight = 90;

const FooterContainer = styled.div`
    display: flex;
    flex-direction: column;
    bottom: 0;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding: 5px 0;
    a.home-link {
        text-decoration: none;
    }
    .copyright-text {
        font-size: 0.8rem;
    }
    .footer-icon-links {
        display: flex;
        flex-direction: row;
        height: 42px;
        align-items: center;
        margin-bottom: 5px;
        .footer-icon-link {
            position: relative;
            height: 30px;
            width: 30px;
            object-fit: contain;
            margin: 2px 9px;
            &.opensea-icon {
                height: 42px;
                width: 42px;
                margin: 0;
            }
        }
    }
`;

const iconLinks = [
    { icon: DiscordIcon, url: EXTERNAL_LINKS.DISCORD, name: "Legend Maps Discord", className: "discord-icon" },
    { icon: TwitterIcon, url: EXTERNAL_LINKS.TWITTER, name: "Legend Maps Twitter", className: "twitter-icon" },
    { icon: OpenseaIcon, url: EXTERNAL_LINKS.OPENSEA, name: "Legend Maps Opensea", className: "opensea-icon" },
    { icon: LooksrareIcon, url: EXTERNAL_LINKS.LOOKSRARE, name: "Legend Maps Looksrare", className: "looksrare-icon" },
    { icon: EtherscanIcon, url: EXTERNAL_LINKS.ETHERSCAN, name: "Legend Maps Etherscan", className: "etherscan-icon" },
];

const Footer = () => {
    const router = useRouter();
    const {
        gameStore,
        gameStore: { activeGameScreen },
    } = React.useContext(RootStoreContext);
    const showGameFooter =
        router.pathname === "/game" && activeGameScreen !== "landing" && activeGameScreen !== "splash";

    if (showGameFooter) {
        return <FooterContainer></FooterContainer>;
    }
    return (
        <FooterContainer>
            <Link href="/">
                <a className="home-link">Home</a>
            </Link>
            <div className="footer-icon-links">
                {iconLinks.map(({ icon, name, url, className }) => (
                    <ExternalLink key={name} className={`footer-icon-link ${className}`} href={url}>
                        <Image src={icon} alt={name} layout="fill" />
                    </ExternalLink>
                ))}
            </div>
            <form
                style={{
                    background: "#000",
                    borderRadius: 2,
                    padding: 10,
                    display: "inline-block",
                    margin: "20px 0",
                }}
                action="https://buttondown.email/api/emails/embed-subscribe/legendmaps"
                method="post"
                target="popupwindow"
                onSubmit={() => {
                    window.open("https://buttondown.email/legendmaps", "popupwindow");
                }}
            >
                <h3>Subscribe to Our Newsletter</h3>
                <input
                    css={css`
                        background: #000;
                        border: 1px solid #fff;
                        color: #fff;
                        padding: 0 10px;
                        min-height: 38px;
                        margin-top: 1px;
                        margin-bottom: 10px;
                        width: 100%;
                        ::selection {
                            color: #000;
                            background: #fff;
                        }
                    `}
                    name="email"
                    type="email"
                    placeholder="Your email"
                />
                <input
                    css={css`
                        cursor: pointer;
                        display: flex;
                        position: relative;
                        justify-content: center;
                        align-items: center;
                        text-decoration: none;
                        border: 2px solid ${palette.primary.gray};
                        color: white;
                        max-width: 250px;
                        padding: 0.2em 2em 0 2em;
                        line-height: 37px;
                        background: #000;
                        .label {
                            &.chevron {
                                padding-right: 22px;
                            }
                        }

                        i {
                            position: absolute;
                            right: 0;
                            top: 46%;
                            transform: translate(-35%, -50%);
                        }
                    `}
                    type="submit"
                    value="Subscribe"
                />
            </form>
            <div className="copyright-text">© 2022 Legend Maps Team</div>
        </FooterContainer>
    );
};

export default Footer;
