---
title: "getUrl()"
published: 2023-03-26
tag: "Astro"
description: "URL routing for content collections"
---

Astro added [content collections](https://docs.astro.build/en/guides/content-collections/) in v2.0, and while it's overall a big improvement for pages like blog posts where there's a uniform schema, it makes generating links to your content just a bit harder than file-based routing. I added a helper function and some Typescript types to `content.ts` to make it easy to map content collections to URLs in a typesafe way that your editor can help auto-complete.

```typescript
export const collections = {
  // Your collections here
  // see https://docs.astro.build/en/guides/content-collections/#defining-multiple-collections
  coll1: defineCollection(),
  coll2: defineCollection(),
  coll3: defineCollection(),
};

type UrlMap = Partial<{
  [key in keyof typeof collections]: string;
}>;

const urls: UrlMap = {
  coll1: "/path/to-coll1/",
  coll2: "/path-to/coll2/",
  coll3: "/path/to/coll3/",
};

export const getUrl = (collName: keyof typeof urls, slug: string) =>
  urls[collName] + slug;
```

In your Astro components, you can then call `getUrl("collName", slug)` to get the URL.

While it's just a bit of string concatenation, the added type safety can make a big difference in a larger project. Even on this website, I've found the autocomplete for the collection name to be very helpful.