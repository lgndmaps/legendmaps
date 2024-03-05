import Link from "next/link";
import {useRouter} from "next/router";
import settings from "../../../settings";
import {IAdventurerD} from "../../../types/adventurerTypes";
import {useSession} from "../../hooks/useSession";

export interface AdventurerThumbnailProps {
    adventurer: IAdventurerD;
    isMine?: boolean;
}

const AdventurerThumbnail = ({adventurer, isMine = false}: AdventurerThumbnailProps) => {
    const {viewingAdventurer, setViewingAdventurer} = useSession();
    const router = useRouter();
    const imageURL = `${settings.S3_URL}adv/p250/portrait_${adventurer.tokenId}.png`;
    return (
        <Link href={`/adventurers/${adventurer.tokenId}`} passHref>
            <a className="adventurer-thumbnail">
                <div className="adventurer-thumbnail__image">

                    <img src={`${settings.S3_URL}adv/p/portrait_${adventurer.tokenId}.png`} alt={adventurer.name}/>
                </div>
                <div className="adventurer-thumbnail__name">
                    {adventurer.tokenId > 9999
                        ? <span>[Visiting Adventurer]</span> : <span>#{adventurer.tokenId}</span>} {adventurer.name}
                </div>
            </a>
        </Link>
    );
};

export default AdventurerThumbnail;
