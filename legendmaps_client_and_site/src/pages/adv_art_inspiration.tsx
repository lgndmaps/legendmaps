import dynamic from "next/dynamic";
const PDFViewer = dynamic(() => import("../app/components/GlobalLayout/PDFViewerArt"), {
    ssr: false,
});
const GDD = (): JSX.Element => {
    return (
        <>
            <div className="section-title">
                <h1>Adventurer's Art Inspiration</h1>
            </div>
            <PDFViewer />
        </>
    );
};

export default GDD;
