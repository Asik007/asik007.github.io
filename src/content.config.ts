import { defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			// Transform string to Date object
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: z.optional(image()),
      tags: z.array(z.string()).optional(),
		}),
});

const projects = defineCollection({
	// Load Markdown and MDX files in the `src/content/projects/` directory.
	loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
      active: z.boolean().optional(),
			// Transform string to Date object
			heroImage: z.optional(image()),
      tags: z.array(z.string()).optional(),
      pubDate: z.coerce.date(),
		}),
});

// ------------------- Zod Schemas (runtime validation & type inference) -------------------
// src/content/config.ts
// ---------- Helper schemas ----------

// An entry can be a simple string or an object with any keys.
const SectionEntrySchema = z.union([
  z.string(),
  z.object({}).catchall(z.any()), // accepts any object
]);

// The 'cv' object – we validate the core fields, but sections are flexible.
const CvSchema = z.object({
  name: z.string(),
  headline: z.string().optional(),
  location: z.string().optional(),
  email: z.string().optional(), // can be string or array, but we keep simple
  photo: z.string().optional(),
  phone: z.string().optional(),
  website: z.string().optional(),
  social_networks: z
    .array(
      z.object({
        network: z.string(),
        username: z.string(),
      })
    )
    .optional(),
  custom_connections: z.array(z.any()).optional(),
  sections: z.record(z.array(SectionEntrySchema)).optional(),
});

// Root schema – matches the YAML exactly
const FullRenderCVSchema = z.object({
  cv: CvSchema,
  design: z.any().optional(),          // complex; keep flexible
  locale: z.any().optional(),
  settings: z.any().optional(),
});

// ------------------- Collection Definition -------------------

const cv = defineCollection({
  loader: file("src/content/cv/cv.yml"),
  schema: FullRenderCVSchema.shape.cv, // merges { cv: { ... } } into this object
});



// // ------------------- Inferred Types (optional, for use in components) -------------------

// export type RenderCVEntry = z.infer<typeof RenderCVEntrySchema>;
// export type RenderCV = z.infer<typeof RenderCVSchema>;
// // You can also infer the exact collection entry type:
// export type CVCollectionEntry = {
//   id: string;
//   data: z.infer<typeof cv.schema>;
// };

export const collections = { blog, cv, projects };
