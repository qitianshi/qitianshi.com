// webpack config file.

// Copyright 2023 Qi Tianshi. All rights reserved.


const path = require("path");

module.exports = {
    mode: "none",       // Use `--mode` instead.
    entry: path.join(__dirname, "src", "_webpack", "main.js"),
    output: {
        path: path.resolve(__dirname, "src", "assets", "scripts"),
        filename: "bundle.js",
    },
    module: {
        rules: [
            {
                test: /.js$/,
                exclude: [
                    path.resolve(__dirname, "node_modules"),
                    path.resolve(__dirname, "bower_components"),
                ],
                loader: "babel-loader",
                // query: {
                //     presets: ["env"],
                // },
            },
        ],
    },
    resolve: {
        extensions: [".json", ".js", ".jsx"],
    },
};
