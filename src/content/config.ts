import {
  z,
  defineCollection,
  getCollection,
  CollectionEntry,
} from "astro:content";

const partialDate = () =>
  z
    .string()
    .or(z.date())
    .transform((arg) => new Date(arg));

const JobCollection = defineCollection({
  schema: z.object({
    company: z.string(),
    location: z.string(),
    logo: z.string().optional(),
    title: z.string(),
    start: partialDate(),
    end: partialDate().or(z.null()),
    showDetails: z.boolean().optional(),
  }),
});

const DegreeCollection = defineCollection({
  schema: z.object({
    degree: z.string(),
    field: z.string().optional(),
    institution: z.string(),
    graduation: partialDate(),
    gpa: z.string().or(z.number()).optional(),
    hide: z.boolean().optional(),
  }),
});

const ProjectCollection = defineCollection({
  schema: z.object({
    name: z.string(),
    tags: z.array(z.string()).optional(),
    description: z.string(),
    date: z.string(),
    draft: z.boolean().optional(),
    details: z.boolean().optional(),
  }),
});

const BlogPostCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: partialDate(),
    draft: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    highlight: z.boolean().default(false),
  }),
});

export const collections = {
  work: JobCollection,
  education: DegreeCollection,
  projects: ProjectCollection,
  blog: BlogPostCollection,
};

const urls = {
  blog: "/blog/",
  projects: "/projects/",
};

export const getUrlForCollectionEntry = (t: keyof typeof urls, slug: string) =>
  (urls[t] || "/") + slug;

export async function getBlogPosts(
  pred?: (e: CollectionEntry<"blog">) => boolean
) {
  const posts = await getCollection(
    "blog",
    (p) => !p.data.draft && (!pred || pred(p))
  );
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}
