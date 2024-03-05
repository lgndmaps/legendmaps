import Title from "../ui/Title";

interface IProps {
    title: string;
}

export const DwellersCompendium = ({ title }: IProps) => {
    return (
        <div>
            <Title text={title} />
        </div>
    );
};
