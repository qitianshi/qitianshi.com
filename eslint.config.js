import globals from "globals";
import js from "@eslint/js";

export default [
    js.configs.recommended,
    {
        languageOptions: {
            "ecmaVersion": "latest",
            "sourceType": "module",
            "globals": {
                ...globals.browser,
                ...globals.es2021,
            },
        },
        rules: {
            "semi": ["error", "always"],
            "no-unused-vars": "warn",
        },
    }
];
