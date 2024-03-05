import * as React from "react";
import {useState} from "react";
import UserDetails from "./UserDetails";
import Image from "next/image";
import Logo from "../../../assets/images/logo.png";
import HorizontalLogo from "../../../assets/images/legend-maps-logo-horizontal.png";
import {useRouter} from "next/dist/client/router";
import {useBreakpoints} from "../../../styles/styleUtils";
import MobileNavButton from "./MobileNavButton";
import MobileNav from "./MobileNav";
import ClientOnly from "../../../util/ClientOnly";
import {useOnScroll} from "../../hooks/useScroll";
import {AnimatePresence, motion} from "framer-motion";
import {headerHeight} from "./layout";
import DropDownMenu from "../ui/DropDownMenu/DropDownMenu";
import {StyledMenuItem} from "../ui/DropDownMenu/DropDownMenu.styled";
import Link from "next/link";
import {EXTERNAL_LINKS} from "../../../constants/externalLinks";
import {RootStoreContext} from "../../../stores/with-root-store";
import {observer} from "mobx-react-lite";
import {css} from "@emotion/react";

export interface IHeaderNavLink {
    name: string;
    links?: IHeaderNavLink[];
    url?: string;
    icon?: string;
    iconWidth?: number;
    newTab?: boolean;
    onClick?: () => void;
}

const navLinks: IHeaderNavLink[] = [
    {name: "Maps", url: "/maps"},
    {name: "Adventurers", url: "/adventurers"},
    {
        name: "Dwellers",

        links: [
            {name: "Introduction", url: "/dwellers/introduction"},
            {name: "Index", url: "/dwellers"},
        ],
    },
    {name: "Game", url: "/game"},
    //{ name: "Lore", url: "/lore" },
    {
        name: "Links",
        links: [
            {name: "Legend Maps Discord", url: EXTERNAL_LINKS.DISCORD, newTab: true},
            {name: "Opensea", url: EXTERNAL_LINKS.OPENSEA, newTab: true},
            {name: "LooksRare", url: EXTERNAL_LINKS.LOOKSRARE, newTab: true},
            {name: "Etherscan", url: EXTERNAL_LINKS.ETHERSCAN, newTab: true},
            {name: "Twitter", url: EXTERNAL_LINKS.TWITTER, newTab: true},
        ],
    },
];

const linksArray: IHeaderNavLink[] = [
    {name: "Legend Maps Discord", url: EXTERNAL_LINKS.DISCORD},
    {name: "Opensea", url: EXTERNAL_LINKS.OPENSEA},
    {name: "LooksRare", url: EXTERNAL_LINKS.LOOKSRARE},
    {name: "Etherscan", url: EXTERNAL_LINKS.ETHERSCAN},
    {name: "Twitter", url: EXTERNAL_LINKS.TWITTER},
];

const Header = observer(() => {
    const [isOpen, toggleOpen] = useState<boolean>(false);
    const router = useRouter();
    const {isTabletCeil} = useBreakpoints();
    const {
        gameStore,
        gameStore: {activeGameScreen},
    } = React.useContext(RootStoreContext);
    const handleToggle = () => {
        toggleOpen(!isOpen);
        if (!isOpen) {
            document.body.classList.remove("modal-open");
        } else {
            document.body.classList.add("modal-open");
        }
    };

    const variants = {
        scrolled: {
            height: `${headerHeight - 55}px`,
        },
        top: {height: `${headerHeight}px`},
    };

    const {isScrolled} = useOnScroll(100);
    const showGameHeader =
        router.pathname === "/game" && activeGameScreen !== "landing" && activeGameScreen !== "splash";

    if (showGameHeader) {
        return (
            <header
                className="top"
                css={css`
                  padding: 20px;
                  font-size: 14px;
                  left: 0;
                `}
            >
                {/* <motion.div
                    initial={{ y: -300, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -300, opacity: 0 }}
                    transition={{ type: "spring", duration: 0.8 }}
                >
                    <Button
                        css={css`
                            padding: 5px !important;
                            line-height: 1 !important;
                        `}
                        onClick={() => {
                            gameStore.setActiveGameScreen("landing");
                        }}
                    >
                        Back
                    </Button>
                </motion.div> */}
            </header>
        );
    }

    return (
        <header
            className={isScrolled ? "sticky" : "top"}
            css={css`
              background: ${showGameHeader ? "transparent" : "#000"};
            `}
        >
            <ClientOnly>
                <motion.div
                    className="header-wrapper"
                    animate={isScrolled ? "scrolled" : "top"}
                    transition={{type: "spring", duration: 0.8}}
                    variants={variants}
                >
                    <div className="header-desk">
                        <div style={{display: "flex", alignItems: "center"}}>
                            <div
                                className={`logo-wrapper ${isScrolled ? "sticky" : ""}`}
                                onClick={() => {
                                    router.push("/");
                                }}
                            >
                                <AnimatePresence exitBeforeEnter>
                                    {isScrolled ? (
                                        <motion.div
                                            key="logo"
                                            initial={{opacity: 0}}
                                            animate={{opacity: 1}}
                                            exit={{opacity: 0}}
                                            transition={{ease: "easeInOut", duration: 0.1}}
                                        >
                                            <Image
                                                className="logo"
                                                src={HorizontalLogo}
                                                width={200}
                                                quality={100}
                                                alt="legend maps logo"
                                            />
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="horizonal-logo"
                                            initial={{opacity: 0, y: -100}}
                                            animate={{opacity: 1, y: 0}}
                                            exit={{opacity: 0, y: -100}}
                                            transition={{ease: "easeInOut", duration: 0.1}}
                                        >
                                            <Image
                                                className="logo"
                                                src={Logo}
                                                width={200}
                                                quality={100}
                                                alt="legend maps logo"
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {isTabletCeil && (
                            <>
                                <MobileNavButton toggle={() => handleToggle()}/>
                                <MobileNav
                                    isOpen={isOpen}
                                    links={navLinks}
                                    linksArray={linksArray}
                                    toggleOpen={toggleOpen}
                                />
                            </>
                        )}

                        {!isTabletCeil && (
                            <>
                                <div className="nav-items">
                                    {navLinks.map((link) => (
                                        <div className="nav-link" key={link.name}>
                                            {link.url ? (
                                                <Link href={link.url}>
                                                    <a className="active-link">{link.name}</a>
                                                </Link>
                                            ) : (
                                                <DropDownMenu title={link.name}>
                                                    {link.links.map(({name, url, icon, iconWidth, newTab}) => (
                                                        <StyledMenuItem key={name}>
                                                            {icon && (
                                                                <div className="sub-menu-icon">
                                                                    <img
                                                                        src={icon}
                                                                        alt={name}
                                                                        width={iconWidth ? iconWidth : 20}
                                                                    />
                                                                </div>
                                                            )}
                                                            <a
                                                                href={url}
                                                                rel="noopener noreferrer"
                                                                target={`${newTab === true ? "_blank" : ""}`}
                                                                key={name}
                                                                className="sub-menu-item"
                                                            >
                                                                {name}
                                                            </a>
                                                        </StyledMenuItem>
                                                    ))}
                                                </DropDownMenu>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <div className="header-connect">
                                    <UserDetails
                                        handleClick={() => {
                                            return;
                                        }}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </motion.div>
            </ClientOnly>
        </header>
    );
});

export default Header;
