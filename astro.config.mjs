import { defineConfig } from "astro/config";

const pathToLayout = {
  "/blog": "BlogPost",
  "/resume/projects": "Project",
};

// Simple remark plugin that adds layouts to markdown files based on their path.
// https://github.com/withastro/astro/issues/397#issuecomment-1236231783
function defaultLayoutPlugin() {
  return function (tree, file) {
    if (!file.data.astro.frontmatter.layout) {
      const relativePath = file.path
        .replace(file.cwd, "")
        .replace("/src/pages", "");
      const key = relativePath.split("/").join("/");
      for (const [path, layout] of Object.entries(pathToLayout)) {
        if (key.startsWith(path)) {
          file.data.astro.frontmatter.layout = `@layouts/${layout}.astro`;
        }
      }
    }
  };
}

// https://astro.build/config
export default defineConfig({
  site: "https://davi.sh",
  markdown: {
    remarkPlugins: [defaultLayoutPlugin],
    extendDefaultPlugins: true,
    shikiConfig: {
      // Choose from Shiki's built-in themes (or add your own)
      // https://github.com/shikijs/shiki/blob/main/docs/themes.md
      theme: "solarized-light",
    },
  },
});
