import Link from "next/link";
import { useRouter } from "next/router";
import settings from "../../../settings";
import { IAdventurerD } from "../../../types/adventurerTypes";
import { useSession } from "../../hooks/useSession";
import { css } from "@emotion/react";
import Button from "../ui/Button";

export interface AdventurerThumbnailProps {
    adventurer: IAdventurerD;
    onViewDetails: (adventurer: IAdventurerD) => void;
    onClick: (adventurerId: number) => void;
}

const AdventurerThumbnail = ({ adventurer, onViewDetails, onClick }: AdventurerThumbnailProps) => {
    return (
        <div className="adventurer-thumbnail">
            <div className="adventurer-thumbnail__image">
                <img src={`${settings.S3_URL}adv/p250/portrait_${adventurer.tokenId}.png`} alt={adventurer.name} />
            </div>
            <div
                className="adventurer-thumbnail__name"
                css={css`
                    min-height: 54px;
                `}
            >
                #{adventurer.tokenId} {adventurer.name}
            </div>
            <div
                className="buttons-row"
                css={css`
                    display: flex;
                    justify-content: flex-end;
                    width: 100%;
                    button {
                        margin-left: 5px;
                    }
                `}
            >
                <Button onClick={() => onViewDetails(adventurer)}>Details</Button>
                <Button onClick={() => onClick(adventurer.tokenId)}>Select</Button>
            </div>
        </div>
    );
};

export default AdventurerThumbnail;
