import sharp from "sharp";
import type { APIRoute } from "astro";
import { previewImage } from "../../../components/og/og_image";
import { getEntryBySlug } from "astro:content";
import { getBlogPosts, getSnippets, getWeeklies } from "src/content/config";

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
  return [...blogPaths, ...tilPaths, ...weeklyPaths];
}

export const GET: APIRoute = async function get({ params, request }) {
  let { slug = "", collection } = params;
  const post = await getEntryBySlug(
    (collection === "til" ? "snippets" : collection) as
      | "blog"
      | "snippets"
      | "weekly",
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
          subtitle: post.data.description || null,
          date: post.data.date,
          path,
          tags: post.data.tags,
        }
      : post.collection === "weekly"
        ? {
            title: post.data.title,
            subtitle: null,
            date: post.data.date,
            path,
          }
        : post.collection === "snippets"
          ? {
              title: post.data.description,
              subtitle: post.data.title,
              date: post.data.modified || post.data.published,
              path,
            }
          : ({} as never)
  );
};
