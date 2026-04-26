import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/fixtures.ts"],
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  sourcemap: true,
  treeshake: true,
  splitting: false,
  outDir: "dist",
  target: "es2022",
  outExtension: ({ format }) => ({
    js: format === "cjs" ? ".cjs" : ".js",
  }),
});
