import dynamic from "next/dynamic";
const PDFViewer = dynamic(() => import("../app/components/GlobalLayout/PDFViewer"), {
    ssr: false,
});
const GDD = (): JSX.Element => {
    return (
        <>
            <div className="section-title">
                <h1>Game Design Document</h1>
            </div>
            <PDFViewer />
        </>
    );
};

export default GDD;
