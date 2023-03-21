import rss from "@astrojs/rss";

export const get = () => {
  const postImportResult = import.meta.glob("./blog/**/*.md", {
    eager: true,
  });
  const posts = Object.values(postImportResult);
  return rss({
    title: "Davis Haupt's Blog",
    description: "Thoughts and writeups from Davis Haupt.",
    site: import.meta.env.SITE + "blog",
    items: posts
      .filter((p) => !p.frontmatter.draft)
      .sort(
        (a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date)
      )
      .map((post) => ({
        link: post.url,
        title: post.frontmatter.title,
        pubDate: post.frontmatter.date,
        description: post.compiledContent(),
      })),
    // (optional) inject custom xml
    customData: `<language>en-us</language>`,
  });
};
