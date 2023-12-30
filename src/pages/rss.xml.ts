import rss from "@astrojs/rss";
import {
  getBlogPosts,
  getSnippets,
  getUrlForCollectionEntry,
  getWeeklies,
} from "src/content/config";
import { renderMarkdown } from "src/utils";

export const get = async () => {
  const posts = await getBlogPosts();
  const snippets = await getSnippets();
  const weeklies = await getWeeklies();
  const renderedPosts = await Promise.all(
    posts.map(async (post) => ({
      link: getUrlForCollectionEntry("blog", post.slug),
      title: post.data.title,
      pubDate: post.data.date,
      description: await renderMarkdown(post.body),
    }))
  );
  const renderedSnippets = await Promise.all(
    snippets.map(async (snippet) => ({
      link: getUrlForCollectionEntry("snippets", snippet.slug),
      title: `[TIL] ${snippet.data.title}: ${snippet.data.description}`,
      pubDate: snippet.data.published,
      description: await renderMarkdown(snippet.body),
    }))
  );
  const renderedWeeklies = await Promise.all(
    weeklies.map(async (snippet) => ({
      link: getUrlForCollectionEntry("snippets", snippet.slug),
      title: snippet.data.title,
      pubDate: snippet.data.date,
      description: await renderMarkdown(snippet.body),
    }))
  );
  const items = renderedPosts
    .concat(renderedSnippets)
    .concat(renderedWeeklies)
    .sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());
  return rss({
    title: "Davis Haupt's Blog",
    description: "Thoughts and writeups from Davis Haupt.",
    site: import.meta.env.SITE + "blog",
    items,
    customData: `<language>en-us</language>`,
  });
};
