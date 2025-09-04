import type { APIRoute } from "astro";
import { previewImage } from "../../../components/og/og_image";
import { getEntry } from "astro:content";
import {
  getBlogPosts,
  getReading,
  getSnippets,
  getWeeklies,
} from "src/content/config";

// Thanks to Arne Bahlo for the inspriation!
// https://arne.me/articles/static-og-images-in-astro

export async function getStaticPaths() {
  const blogPaths = (await getBlogPosts()).map((post) => ({
    params: {
      slug: post.slug,
      collection: "blog",
    },
  }));
  const tilPaths = (await getSnippets()).map((post) => ({
    params: {
      slug: post.slug,
      collection: "til",
    },
  }));
  const weeklyPaths = (await getWeeklies()).map((post) => ({
    params: {
      slug: post.slug,
      collection: "weekly",
    },
  }));
  const readingPaths = (await getReading()).map((post) => ({
    params: {
      slug: post.slug,
      collection: "reading",
    },
  }));

  return [...blogPaths, ...tilPaths, ...weeklyPaths, ...readingPaths];
}

export const GET: APIRoute = async function get({ params, request }) {
  let { slug = "", collection } = params;
  if (collection === "reading") {
    slug = slug.split("/").pop() || "";
  }
  const post = await getEntry(
    (collection === "til" ? "snippets" : collection) as
      | "blog"
      | "snippets"
      | "weekly"
      | "reading",
    slug
  );
  if (!post) {
    return new Response(null, { status: 404 });
  }
  let root = post.collection === "snippets" ? "til" : post.collection;
  const path = `${root}/${post.id}`;
  return await previewImage(
    post.collection === "blog"
      ? {
          title: post.data.title,
          date: post.data.date,
          path,
          tags: post.data.tags,
        }
      : post.collection === "weekly"
        ? {
            title: post.data.title,
            date: post.data.date,
            path,
          }
        : post.collection === "snippets"
          ? {
              title: post.data.description,
              date: post.data.modified || post.data.published,
              path,
            }
          : post.collection === "reading"
            ? {
                title: `Reviewing ${post.data.title} by ${post.data.author}`,
                date: post.data.dateCompleted,
                path,
              }
            : ({} as never)
  );
};
