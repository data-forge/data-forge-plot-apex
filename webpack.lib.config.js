const path = require("path");

module.exports = {
    entry: "./src/index.ts",
    output: {
        path: path.resolve(__dirname, "build"),
        filename: "index.js",
        libraryTarget: "commonjs2",
    },

    target: "node",
    mode: "development", //TODO: Possibly need separate prod and dev templates.
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

};