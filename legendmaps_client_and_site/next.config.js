const { withSentryConfig } = require("@sentry/nextjs");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const removeImports = require("next-remove-imports")();

/**
 * @type {import('next/dist/next-server/server/config').NextConfig}
 **/
const moduleExports = {
    reactStrictMode: true,
    // webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    //   config.plugins.push(
    //     new BundleAnalyzerPlugin({
    //       analyzerMode: "server",
    //       analyzerPort: isServer ? 8888 : 8889,
    //       openAnalyzer: true,
    //     }),
    //   );

    //   return config;
    // },
    ...removeImports({}),
};

const sentryWebpackPluginOptions = {
    // Additional config options for the Sentry Webpack plugin. Keep in mind that
    // the following options are set automatically, and overriding them is not
    // recommended:
    //   release, url, org, project, authToken, configFile, stripPrefix,
    //   urlPrefix, include, ignore

    silent: true, // Suppresses all logs
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options.
};

module.exports = withSentryConfig(moduleExports, sentryWebpackPluginOptions);
