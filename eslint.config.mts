import typescriptEslint from "@typescript-eslint/eslint-plugin";
import prettier from "eslint-plugin-prettier";
import parser from "vue-eslint-parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [{
    ignores: [
        "cypress/cucumber/reports",
        "cypress/cucumber/steps",
        "cypress/downloads",
        "cypress/screenshots",
        "cypress/snapshots",
        "cypress/plugins",
        "**/runner-results",
        "src/env.d.ts"
    ],
}, ...compat.extends(
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:vue/vue3-recommended",
    "prettier",
), {
    plugins: {
        "@typescript-eslint": typescriptEslint,
        prettier,
    },

    languageOptions: {
        parser: parser,
        ecmaVersion: 5,
        sourceType: "script",

        parserOptions: {
            parser: "@typescript-eslint/parser",
        },
    },

    rules: {
      "prettier/prettier": "error",
      "vue/multi-word-component-names": "off",
      "vue/prop-name-casing": "off",
      "no-console": ["warn", { "allow": ["warn", "error", "info", "debug", "table", "trace", "time", "timeEnd", "group", "groupEnd", "assert", "count", "dir"] }],
      "vue/no-unused-components": "error",
      "@typescript-eslint/no-unused-vars": ["error", {
        "argsIgnorePattern": "^_",
          "varsIgnorePattern": "^_",
          "destructuredArrayIgnorePattern": "^_",
          "ignoreRestSiblings": true,
          "caughtErrorsIgnorePattern": "^(err|error)$" 
      }],
      "prefer-const": "warn",
      "vue/order-in-components": "warn",
      "vue/valid-v-slot": ["error", {
          allowModifiers: true,
      }],
    },
}];
