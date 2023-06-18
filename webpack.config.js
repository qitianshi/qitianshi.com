// webpack config file.

// Copyright 2023 Qi Tianshi. All rights reserved.


// JavaScript source files are placed in ./src/_webpack. webpack minifies the
// files and writes the compiled results to ./src/assets/scripts, where they
// are picked up by Jekyll.

const path = require("path");

module.exports = {

    mode: "none",       // Use `--mode` instead.

    // main.js is loaded with the defer attribute to improve page load time.
    // preload.js is for code that affects the immediate appearance of the page
    // and must thus be loaded before the page renders.
    entry: {
        main: path.join(__dirname, "src", "_webpack", "main.js"),
        preload: path.join(__dirname, "src", "_webpack", "preload.js"),
    },

    output: {
        path: path.resolve(__dirname, "src", "assets", "scripts"),
        filename: "[name].js",
    },

    module: {
        rules: [
            {
                test: /.js$/,
                include: [
                    path.resolve(__dirname, "src", "_webpack"),
                ],
                loader: "babel-loader",
                options: {
                    presets: ['@babel/preset-env']
                }
            },
        ],
    },

    resolve: {
        extensions: [".json", ".js", ".jsx"],
    },

};
