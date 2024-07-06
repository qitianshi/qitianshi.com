// ESLint config file.

// Copyright 2024 Qi Tianshi. All rights reserved.


const globals = require("globals");
const js = require("@eslint/js");

module.exports = [
    js.configs.recommended,
    {
        languageOptions: {
            "ecmaVersion": "latest",
            "sourceType": "module",
            "globals": {
                ...globals.browser,
                ...globals.es2021,
                ...globals.node,
                "gsap": "readonly",
                "ScrollTrigger": "readonly",
            },
        },
        rules: {
            "semi": ["error", "always"],
            "no-unused-vars": "warn",
        },
    }
];
