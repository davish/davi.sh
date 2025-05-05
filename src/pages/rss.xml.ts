import rss from "@astrojs/rss";
import {
  getBlogPosts,
  getSnippets,
  getReading,
  getUrlForCollectionEntry,
} from "src/content/config";
import { extractYear, renderMarkdown } from "src/utils";

export const GET = async function get() {
  const posts = await getBlogPosts();
  const snippets = await getSnippets();
  const reading = await getReading();
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
  const renderedReading = await Promise.all(
    reading.map(async (entry) => ({
      link: getUrlForCollectionEntry(
        "reading",
        `${extractYear(entry.data.dateCompleted)}/${entry.slug}`
      ),
      title: `Reviewing ${entry.data.title} by ${entry.data.author}`,
      pubDate: entry.data.dateCompleted,
      description: await renderMarkdown(entry.body),
    }))
  );
  const items = renderedPosts
    .concat(renderedSnippets)
    .concat(renderedReading)
    .sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());
  const { body } = await rss({
    title: "Davis Haupt's Blog",
    description: "Thoughts and writeups from Davis Haupt.",
    site: import.meta.env.SITE + "blog",
    items,
    customData: `<language>en-us</language>`,
  });
  return new Response(body, { headers: { "Content-Type": "text/xml" } });
};
