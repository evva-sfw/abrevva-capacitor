export default {
  input: "dist/esm/index.js",
  output: [
    {
      name: "capacitorAbrevva",
      file: "dist/plugin.js",
      format: "iife",
      globals: {
        "@capacitor/core": "capacitorExports",
        throat: "throat",
      },
      sourcemap: true,
      inlineDynamicImports: true,
    },
    {
      file: "dist/plugin.cjs.js",
      format: "cjs",
      sourcemap: true,
      inlineDynamicImports: true,
    },
  ],
  external: ["@capacitor/core", "throat"],
};
