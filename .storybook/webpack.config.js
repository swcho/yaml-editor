const path = require("path");
const webpack = require('webpack');
// const TSDocgenPlugin = require("react-docgen-typescript-webpack-plugin");
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = (baseConfig, env, config) => {
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    loader: require.resolve("awesome-typescript-loader")
  });
  // config.plugins.push(new TSDocgenPlugin()); // optional
  // config.plugins.push(new MonacoWebpackPlugin(webpack, {
  //   'vs/language/yaml/yamlWorker': './src/yaml/yamlWorker',
  // })); // optional
  config.resolve.extensions.push(".ts", ".tsx");

  // https://github.com/webpack/webpack/issues/6642#issuecomment-370222543
  config.output.globalObject = "this";

  // https://github.com/webpack-contrib/css-loader/issues/447#issuecomment-285598881
  // https://stackoverflow.com/a/51669301/5742483
  config.node = {
    fs: "empty",
  };
  return config;
};
