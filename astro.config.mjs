import { defineConfig } from "astro/config";
import remarkSidenotes from "@tufte-markdown/remark-sidenotes";
import remarkCallouts from "remark-callouts";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  site: "https://davi.sh/",
  markdown: {
    remarkPlugins: [remarkSidenotes, remarkCallouts],
    shikiConfig: {
      // Choose from Shiki's built-in themes (or add your own)
      // https://github.com/shikijs/shiki/blob/main/docs/themes.md
      theme: "solarized-light",
    },
  },
  integrations: [react()],
});
