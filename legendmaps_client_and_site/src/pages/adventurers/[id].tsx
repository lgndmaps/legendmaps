import MapViewComponent from "../../app/components/MapViewer/MapViewComponent";
import { IAdventurerD } from "../../types/adventurerTypes";
import { getAdventurerServerSide } from "../../util/api/ServerSideApi";
import { AdventurerViewComponent } from "../../app/components/AdventurerViewer/AdventurerViewComponent";
export interface IAdventurerServerProps {
    adventurerId?: number;
    adventurerData?: IAdventurerD;
    notFound?: boolean;
}

export default function Map({ adventurerId, adventurerData, notFound }: IAdventurerServerProps): JSX.Element {
    if (notFound || !adventurerData) {
        return <>No adventurer found for token ID {adventurerId}</>;
    }
    return <AdventurerViewComponent adventurerData={adventurerData} />;
}

export const getServerSideProps = async (ctx) => {
    const { id } = ctx.params;
    const parsedId = parseInt(id, 10);
    const serverProps = await getAdventurerServerSide(id);
    return { props: { ...serverProps, adventurerId: parsedId } };
};
