import js from "@eslint/js";
import prettierRecommended from "eslint-plugin-prettier/recommended";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import babelParser from "@babel/eslint-parser";
import globals from "globals";

export default [
  {
    ignores: ["**/node_modules/", "test-app/", "dist/", "ios/", "android/"],
  },
  js.configs.recommended,
  prettierRecommended,
  {
    rules: {
      "prettier/prettier": [
        "error",
        {
          trailingComma: "all",
          printWidth: 120,
          tabWidth: 2,
          useTabs: false,
        },
      ],
    },
  },
  {
    files: ["**/*.js", "**/*.cjs", "**/*.mjs"],
    languageOptions: {
      sourceType: "module",
      ecmaVersion: "latest",
      globals: {
        ...globals.node,
      },
    },
  },
  {
    files: ["**/*.cjs"],
    languageOptions: {
      parser: babelParser,
      sourceType: "script",
    },
  },
  {
    files: ["src/**/*.ts", "src/**/*.spec.ts"],
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    languageOptions: {
      parser: tsParser,
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];
