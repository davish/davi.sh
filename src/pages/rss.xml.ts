import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { getBlogPosts, getUrlForCollectionEntry } from "src/content/config";
import { renderMarkdown } from "src/utils";

export const get = async () => {
  const posts = await getBlogPosts();
  const items = await Promise.all(
    posts.map(async (post) => ({
      link: getUrlForCollectionEntry("blog", post.slug),
      title: post.data.title,
      pubDate: post.data.date,
      description: await renderMarkdown(post.body),
    }))
  );
  return rss({
    title: "Davis Haupt's Blog",
    description: "Thoughts and writeups from Davis Haupt.",
    site: import.meta.env.SITE + "blog",
    items,
    // (optional) inject custom xml
    customData: `<language>en-us</language>`,
  });
};
