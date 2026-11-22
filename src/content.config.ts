import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
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
			// 썸네일 번호(1~25). 비우면 글 주소로 자동 배정된다. 그림은 src/lib/art.ts
			thumb: z.number().int().min(1).max(25).optional(),
			// URL에 그대로 쓰이므로 영문 소문자로 적는다 (예: tech, life)
			category: z.string().regex(/^[a-z0-9-]+$/).default('tech'),
			tags: z.array(z.string()).default([]),
			draft: z.boolean().default(false),
		}),
});

export const collections = { blog };
