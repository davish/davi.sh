import rss from "@astrojs/rss";
import {
  getBlogPosts,
  getSnippets,
  getUrlForCollectionEntry,
  getWeeklies,
} from "src/content/config";
import { renderMarkdown } from "src/utils";

export const get = async () => {
  const weeklies = await getWeeklies();
  const renderedWeeklies = await Promise.all(
    weeklies.map(async (snippet) => ({
      link: getUrlForCollectionEntry("snippets", snippet.slug),
      title: snippet.data.title,
      pubDate: snippet.data.date,
      description: await renderMarkdown(snippet.body),
    }))
  );
  const items = renderedWeeklies
    .sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());
  return rss({
    title: "Weekly Roundup from Davis Haupt",
    description: "Links and thoughts curated by Davis Haupt",
    site: import.meta.env.SITE + "blog",
    items,
    customData: `<language>en-us</language>`,
  });
};
