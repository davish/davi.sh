import rss from "@astrojs/rss";

export const get = () => {
  const postImportResult = import.meta.glob("./blog/**/*.md", {
    eager: true,
  });
  const posts = Object.values(postImportResult);
  return rss({
    // `<title>` field in output xml
    title: "Davis Haupt's Blog",
    // `<description>` field in output xml
    description: "Thoughts and writeups from Davis Haupt.",
    // base URL for RSS <item> links
    // SITE will use "site" from your project's astro.config.
    site: import.meta.env.SITE,
    // list of `<item>`s in output xml
    // simple example: generate items for every md file in /src/pages
    // see "Generating items" section for required frontmatter and advanced use cases
    items: posts
      .filter((p) => !p.frontmatter.draft)
      .sort(
        (a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date)
      )
      .map((post) => ({
        link: post.url,
        title: post.frontmatter.title,
        date: post.frontmatter.date,
        description: post.compiledContent(),
      })),
    // (optional) inject custom xml
    customData: `<language>en-us</language>`,
  });
};
