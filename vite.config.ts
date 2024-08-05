import { resolve } from "path";
import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

export default defineConfig({
  plugins: [solid()],
  resolve: {
    alias: {
      "~": resolve(__dirname, "./src"),
    },
  },
  root: "src",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    minify: true,
    rollupOptions: {
      input: {
        options: resolve(__dirname, "./src/options.html"),
        background: resolve(__dirname, "./src/background.ts"),
      },
      output: {
        entryFileNames: `[name].js`,
        chunkFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`,
      },
    },
  },
});
