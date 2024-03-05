import Document, { DocumentContext, Html, Head, Main, NextScript } from "next/document";
import { ServerStyleSheet } from "styled-components";

export default class MyDocument extends Document {
    static async getInitialProps(ctx: DocumentContext) {
        const sheet = new ServerStyleSheet();
        const originalRenderPage = ctx.renderPage;
        // ctx.asPath && getQueryServerSide(ctx.asPath);
        try {
            ctx.renderPage = () =>
                originalRenderPage({
                    enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props} />),
                });

            const initialProps = await Document.getInitialProps(ctx);
            return {
                ...initialProps,
                styles: (
                    <>
                        {initialProps.styles}
                        {sheet.getStyleElement()}
                    </>
                ),
            };
        } finally {
            sheet.seal();
        }
    }

    render() {
        return (
            <Html>
                <Head>
                    <link rel="apple-touch-icon" sizes="180x180" href="/images/favicons/apple-touch-icon.png?v=1.0" />
                    <link rel="icon" type="image/png" sizes="32x32" href="/images/favicons/favicon-32x32.png?v=1.0" />
                    <link rel="icon" type="image/png" sizes="16x16" href="/images/favicons/favicon-16x16.png?v=1.0" />
                    <link rel="manifest" href="/images/favicons/site.webmanifest?v=1.0" />
                    <link rel="shortcut icon" href="/images/favicons/favicon.ico?v=1.0" />
                    <meta name="msapplication-TileColor" content="#000000" />
                    <meta name="msapplication-config" content="/images/favicons/browserconfig.xml?v=1.0" />
                    <meta name="theme-color" content="#ffffff" />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}
