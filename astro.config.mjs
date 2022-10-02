import { defineConfig } from "astro/config";

// TODO: Sitemap
// TODO: RSS
// https://astro.build/config
export default defineConfig({
  site: "https://davi.sh",
  markdown: {
    shikiConfig: {
      // Choose from Shiki's built-in themes (or add your own)
      // https://github.com/shikijs/shiki/blob/main/docs/themes.md
      theme: "solarized-light",
    },
  },
});
