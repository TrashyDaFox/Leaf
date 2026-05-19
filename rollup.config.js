const { nodeResolve } = require("@rollup/plugin-node-resolve");
const commonjs = require("@rollup/plugin-commonjs");
const fs = require("fs");
// import { terser } from "@rollup/plugin-terser"; // uncomment if you want minify


  
module.exports = {
  input: "./scripts/startup.js",
  output: {
    file: "./dist/startup.js",
    format: "es",          // ESM output, so TLA is valid
    sourcemap: false,
    inlineDynamicImports: true,
    banner: fs.readFileSync("./banner.js").toString()
  },
  watch: {
    include: ["scripts/**/*.js", "banner.js"],
    clearScreen: false,
  },
  plugins: [
    // prioritizeStartup(),
    nodeResolve({
      browser: false,
      preferBuiltins: true,
    }),
    commonjs(),
    // terser(), // enable if you want minification
  ],
  external: (id) => id.startsWith("@minecraft/"), // keep Minecraft modules external
  preserveEntrySignatures: "strict",
};
