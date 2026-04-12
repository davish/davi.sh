import { z, defineCollection } from "astro:content";
import { glob } from "astro/loaders";

const partialDate = () =>
  z
    .string()
    .or(z.date())
    .transform((arg) => {
      const date = new Date(arg);
      if (date.getHours() === 0 && date.getMinutes() === 0) {
        // Set time to 5PM UTC if not time is set
        date.setUTCHours(17, 0, 0, 0);
      }
      return date;
    });

const JobCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/work" }),
  schema: z.object({
    company: z.string(),
    location: z.string(),
    logo: z.string().optional(),
    title: z.string(),
    start: partialDate(),
    end: partialDate().or(z.null()),
    print: z.boolean().optional(),
    skills: z.array(z.string()).default([]),
  }),
});

const DegreeCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/education" }),
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
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
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
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    date: partialDate(),
    draft: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    highlight: z.boolean().default(false),
  }),
});

const SnippetCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/snippets" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    published: partialDate(),
    modified: partialDate().optional(),
    category: z.string(),
  }),
});

const ShortCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/shorts" }),
  schema: z.object({
    date: partialDate(),
    tags: z.array(z.string()).default([]),
    url: z.url().optional(),
    via: z.url().optional(),
    title: z.string(),
  }),
});

const WeeklyCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/weekly" }),
  schema: z.object({
    title: z.string(),
    date: partialDate(),
  }),
});

const ReadingCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/reading" }),
  schema: z.object({
    title: z.string(),
    dateCompleted: partialDate(),
    rating: z.number().min(0.5).max(5),
    author: z.string(),
    publishYear: z.number().min(1900).max(new Date().getFullYear()),
    genre: z
      .union([z.string(), z.array(z.string())])
      .transform((x) => (Array.isArray(x) ? x : [x]))
      .default([]),
  }),
});

export const collections = {
  work: JobCollection,
  education: DegreeCollection,
  projects: ProjectCollection,
  blog: BlogPostCollection,
  snippets: SnippetCollection,
  shorts: ShortCollection,
  weekly: WeeklyCollection,
  reading: ReadingCollection,
};
