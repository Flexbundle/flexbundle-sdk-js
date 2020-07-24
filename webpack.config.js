const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
    entry: path.resolve(__dirname, "src", "flexbundle-sdk.js"),
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "flexbundle-sdk.js"
    },
    plugins: [ new CleanWebpackPlugin() ]
};