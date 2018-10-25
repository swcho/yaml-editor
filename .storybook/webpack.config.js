const path = require("path");
const webpack = require('webpack');
const TSDocgenPlugin = require("react-docgen-typescript-webpack-plugin");
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = (baseConfig, env, config) => {
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    loader: require.resolve("awesome-typescript-loader")
  });
  config.plugins.push(new TSDocgenPlugin()); // optional
  // config.plugins.push(new MonacoWebpackPlugin(webpack, {
  //   'vs/language/yaml/yamlWorker': './src/yaml/yamlWorker',
  // })); // optional
  config.resolve.extensions.push(".ts", ".tsx");
  return config;
};
