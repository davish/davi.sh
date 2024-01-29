import rss from "@astrojs/rss";
import {
  getUrlForCollectionEntry,
  getWeeklies,
} from "src/content/config";
import { renderMarkdown } from "src/utils";

export const get = async () => {
  const weeklies = await getWeeklies();
  const renderedWeeklies = await Promise.all(
    weeklies.map(async (weekly) => ({
      link: getUrlForCollectionEntry("weekly", weekly.slug),
      title: weekly.data.title,
      pubDate: weekly.data.date,
      description: await renderMarkdown(weekly.body),
    }))
  );
  const items = renderedWeeklies
    .sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());
  return rss({
    title: "Weekly Links from Davis Haupt",
    description: "Curated links and commentary by Davis Haupt",
    site: import.meta.env.SITE + "weekly",
    items,
    customData: `<language>en-us</language>`,
  });
};
