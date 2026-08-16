import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";

const collections = {
  work: "work",
  education: "education",
  projects: "projects",
  blog: "blog",
  snippets: "snippets",
  shorts: "shorts",
  weekly: "weekly",
  reading: "reading",
} as const;

type UrlMap = Partial<{
  [key in keyof typeof collections]: string;
}>;

const urls: UrlMap = {
  blog: "/blog/",
  projects: "/projects/",
  snippets: "/til/",
  shorts: "/µ/",
  weekly: "/weekly/",
  reading: "/reading/",
};

export type ShortParam = {
  year: string;
  month: string;
  day: string;
  post: string;
};
export const splitShortSlug = (slug: string): ShortParam => {
  const parts = slug.split("-");
  if (parts.length !== 4) {
    throw new Error("short post slug must have 4 parts.");
  }
  const [year, month, day, post] = parts as [string, string, string, string];
  return { year, month, day, post };
};

export const makePathForShortPost = (slug: string): string => {
  const { year, month, day, post } = splitShortSlug(slug);
  return `${year}/${month}/${day}/${post}`;
};

export const getUrlForCollectionEntry = (t: keyof typeof urls, slug: string) =>
  urls[t] + slug;

export async function getBlogPosts(
  pred?: (e: CollectionEntry<"blog">) => boolean
) {
  const posts = await getCollection(
    "blog",
    (p) => !p.data.draft && (!pred || pred(p))
  );
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function getSnippets(
  pred?: (e: CollectionEntry<"snippets">) => boolean
) {
  const snippets = await getCollection("snippets", (s) => !pred || pred(s));
  const date = (e: CollectionEntry<"snippets">) =>
    e.data.modified || e.data.published;
  return snippets.sort((a, b) => date(b).valueOf() - date(a).valueOf());
}

export async function getWeeklies(
  pred?: (e: CollectionEntry<"weekly">) => boolean
) {
  const snippets = await getCollection("weekly", (s) => !pred || pred(s));
  return snippets.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function getReading(
  pred?: (e: CollectionEntry<"reading">) => boolean
) {
  const books = await getCollection("reading", (s) => !pred || pred(s));
  return books.sort(
    (a, b) => b.data.dateCompleted.valueOf() - a.data.dateCompleted.valueOf()
  );
}
