import Image from "next/image";
import TwitterLogo from "../../../assets/images/Twitter-Logo_white.svg";
import DiscordLogo from "../../../assets/images/Discord-Logo-White.svg";
import OpenseaLogo from "../../../assets/images/Opensea-Logomark-White.svg";
const SocialLinks = () => {
    return (
        <div className="header-social">
            <a href="https://discord.gg/uGJ7CkR4XY" target="_blank">
                <Image src={DiscordLogo} width={38} quality={95} alt="discord" />
            </a>

            <a href="https://twitter.com/legend_maps/" target="_blank">
                <Image src={TwitterLogo} width={38} quality={95} alt="twitter" />
            </a>

            <a href="https://opensea.io/collection/legend-maps-founder" target="_blank">
                <Image src={OpenseaLogo} width={60} quality={95} alt="opensea" />
            </a>
        </div>
    );
};

export default SocialLinks;
