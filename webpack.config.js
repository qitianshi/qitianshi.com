// webpack config file.

// Copyright 2024 Qi Tianshi. All rights reserved.


/* global __dirname */
/* global module */
/* global require */

// JavaScript source files are placed in ./src/_webpack/. webpack minifies the
// files and writes the compiled results to ./src/assets/scripts/, where they
// are picked up by Jekyll.

const glob = require("glob");
const path = require("path");

const entryBasePath = path.join(__dirname, "src", "_webpack");

module.exports = {

    mode: "none",       // Use `--mode` instead.

    // main.js is loaded with the defer attribute to improve page load time.
    // preload.js is for code that affects the immediate appearance of the page
    // and must thus be loaded before the page renders. Local scripts are each
    // given their own entry point.
    entry: {

        // Entry points for main.js and preload.js.
        main: path.join(entryBasePath, "main.js"),
        preload: path.join(entryBasePath, "preload.js"),

        // Finds every .js file in ./src/_webpack/pages and makes them each an
        // entry point. The name of the entry point is the filepath of the file
        // relative to the ./src/_webpack/ directory, hence the output will
        // mirror the same file structure.
        ...glob.sync(
            path.join(entryBasePath, "pages", "**", "**.js")
        ).reduce(
            function (chunkObject, filepath) {

                const relativePath = path.relative(
                    path.join(entryBasePath, "pages"),
                    filepath
                );

                // Adds the entry point, but removes the extension which is
                // added at the output.
                chunkObject[
                    path.join(
                        "pages",
                        relativePath.slice(
                            0,
                            relativePath.length
                                - path.extname(relativePath).length
                        )
                    )
                ] = filepath;

                return chunkObject;

            }, {}
        ),

    },

    output: {
        path: path.resolve(__dirname, "src", "assets", "scripts"),
        filename: "[name].js",
    },

    module: {
        rules: [
            {
                test: /.js$/,
                include: [path.resolve(entryBasePath)],
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
