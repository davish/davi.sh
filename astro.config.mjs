import { defineConfig } from "astro/config";
import remarkSidenotes from "@tufte-markdown/remark-sidenotes";

function hasFootnotesFrontmatterPlugin() {
  return function (tree, file) {
    let footnotes = tree.children.filter(
      ({ type }) => type === "footnoteDefinition"
    );
    file.data.astro.frontmatter.hasFootnotes = footnotes.length > 0;
  };
}

// https://astro.build/config
export default defineConfig({
  site: "https://davi.sh/",
  markdown: {
    remarkPlugins: [hasFootnotesFrontmatterPlugin, remarkSidenotes],
    shikiConfig: {
      // Choose from Shiki's built-in themes (or add your own)
      // https://github.com/shikijs/shiki/blob/main/docs/themes.md
      theme: "solarized-light",
    },
  },
});
