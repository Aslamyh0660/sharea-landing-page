import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import path from "node:path"

// Production base is "/". The sandbox preview builds with `--base=/site/`
// (see package.json "build:sandbox"); code must always build public-asset
// URLs through assetUrl() so both work.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: [
      { find: "@", replacement: path.resolve(__dirname, "./src") },
      // bare "cn" imports (what `shadcn add` writes) resolve to the M3E cn —
      // exact match only, so "cn/config" / "cn/engine" hit the npm package
      {
        find: /^cn$/,
        replacement: path.resolve(__dirname, "./src/lib/m3e/cn.ts"),
      },
    ],
  },
})
