const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: "./src/template.ts",
    output: {
        path: path.resolve(__dirname, "build"),
        filename: "template/assets/index.js",
    },

    mode: "development", //todo: "production",
    devtool: "source-map",

    resolve: {
        extensions: [ ".tsx", ".ts", ".js" ],
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },

    plugins: [
        new CopyWebpackPlugin([
            { 
                from: "src/template",
                to: "template",
            },
        ]),
    ],
};