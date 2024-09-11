module.exports = {
  root: true,
  overrides: [
    {
      files: ["*.ts"],
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: ["tsconfig.json", "tsconfig.app.json"],
        createDefaultProgram: true,
      },
      extends: [
        "plugin:prettier/recommended",
        "plugin:@angular-eslint/recommended",
        "plugin:@angular-eslint/template/process-inline-templates",
      ],
      plugins: ["unused-imports", "simple-import-sort"],
      rules: {
        "max-len": "off",
        "no-console": "off",
        "no-bitwise": "off",
        "no-underscore-dangle": "off",
        "id-blacklist": "off",
        "simple-import-sort/imports": "error",
        "simple-import-sort/exports": "error",
        "unused-imports/no-unused-imports": "error",
        "unused-imports/no-unused-vars": ["warn"],
        "@typescript-eslint/ban-ts-comment": "off",
        "@typescript-eslint/naming-convention": "off",
        "@angular-eslint/component-class-suffix": [
          "error",
          {
            suffixes: ["Page", "Component"],
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
        "@angular-eslint/directive-selector": [
          "error",
          {
            type: "attribute",
            prefix: "app",
            style: "camelCase",
          },
        ],
      },
    },
    {
      files: ["*.html"],
      extends: ["plugin:@angular-eslint/template/recommended"],
      rules: {},
    },
  ],
};
