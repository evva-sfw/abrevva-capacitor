import js from "@eslint/js";
import ts from "typescript-eslint";
import angular from "angular-eslint";
import prettier from "eslint-plugin-prettier/recommended";

export default ts.config(
  {
    ignores: ["projects/**/*"],
  },
  js.configs.recommended,
  prettier,
  {
    files: ["**/*.js", "**/*.mjs"],
    languageOptions: {
      sourceType: "module",
      ecmaVersion: "latest",
    },
  },
  {
    files: ["**/*.cjs"],
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        node: true,
      },
    },
  },
  {
    files: ["src/**/*.ts"],
    extends: [...ts.configs.recommended, ...angular.configs.tsRecommended],
    processor: angular.processInlineTemplates,
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@angular-eslint/prefer-standalone": "off",
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "app",
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "app",
          style: "kebab-case",
        },
      ],
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
    files: ["**/*.html"],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {
      "prettier/prettier": [
        "error",
        {
          parser: "angular",
        },
      ],
    },
  },
);
