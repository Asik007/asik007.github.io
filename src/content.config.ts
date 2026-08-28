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

const RenderCVEntrySchema = z.object({
  institution: z.string().optional(),
  company: z.string().optional(),
  position: z.string().optional(),
  area: z.string().optional(),
  degree: z.string().optional(),
  title: z.string().optional(),
  authors: z.array(z.string()).optional(),
  doi: z.string().optional(),
  date: z.union([z.string(), z.number()]).optional(),
  start_date: z.union([z.string(), z.number()]).optional(),
  end_date: z.union([z.string(), z.number(), z.literal('present')]).optional(),
  location: z.string().optional(),
  journal: z.string().optional(),
  publisher: z.string().optional(),
  url: z.string().optional(),
  highlights: z.array(z.string()).optional(),
  name: z.string().optional(),
  issuer: z.string().optional(),
  label: z.string().optional(),
  details: z.string().optional(),
});

const RenderCVSchema = z.object({
  cv: z.object({
    name: z.string(),
    location: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    website: z.string().optional(),
    summary: z.string().optional(),
    social_networks: z
      .array(
        z.object({
          network: z.string(),
          username: z.string(),
        })
      )
      .optional(),
    sections: z
      .object({
        education: z.array(RenderCVEntrySchema).optional(),
        experience: z.array(RenderCVEntrySchema).optional(),
        publications: z.array(RenderCVEntrySchema).optional(),
        awards: z.array(RenderCVEntrySchema).optional(),
        skills: z.array(RenderCVEntrySchema).optional(),
        languages: z.array(RenderCVEntrySchema).optional(),
        interests: z.array(RenderCVEntrySchema).optional(),
      })
      // Allow any additional section keys (e.g., "volunteer", "certificates")
      .catchall(z.array(RenderCVEntrySchema)),
  }),
});

// ------------------- Collection Definition -------------------

const cv = defineCollection({
  loader: file("src/content/cv/cv.yml"),
  schema: RenderCVSchema.shape.cv, // merges { cv: { ... } } into this object
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
