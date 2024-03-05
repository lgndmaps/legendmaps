import dynamic from "next/dynamic";

const DynamicLanding = dynamic(() => import("../app/landing/Landing"), {
    ssr: false,
});

const Index = (): JSX.Element => {
    return (
        <>
            <DynamicLanding />
        </>
    );
};

export default Index;
