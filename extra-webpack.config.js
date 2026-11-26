const { merge } = require("webpack-merge");
const singleSpaAngularWebpack =
  require("single-spa-angular/lib/webpack").default;

module.exports = (config, options) => {
  const singleSpaWebpackConfig = singleSpaAngularWebpack(config, options);

  if (singleSpaWebpackConfig.output) {
    singleSpaWebpackConfig.output.sourceMapFilename =
      "[file].[contenthash].map[query]";
  }

  return merge(singleSpaWebpackConfig, {
    devServer: {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods":
          "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        "Access-Control-Allow-Headers":
          "X-Requested-With, content-type, Authorization",
      },
    },
  });
};
