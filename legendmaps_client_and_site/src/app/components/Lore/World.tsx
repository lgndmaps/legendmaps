import Title from "../ui/Title";

interface IProps {
    title: string;
}

const World = ({ title }: IProps) => {
    return (
        <div>
            <Title text={title} />
        </div>
    );
};

export default World;
