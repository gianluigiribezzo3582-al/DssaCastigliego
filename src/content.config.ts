import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// Nota per chi lavora dal CMS: i campi "draftNote" servono solo in fase di bozza,
// non vengono mai mostrati in pagina — sono un promemoria interno.

const aree = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/aree" }),
  schema: z.object({
    titolo: z.string(),
    riassunto: z.string().max(220),
    ordine: z.number().int().default(0),
    seoTitle: z.string().optional(),
    seoDescription: z.string().max(160).optional(),
    draftNote: z.string().optional(),
  }),
});

const faq = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/faq" }),
  schema: z.object({
    domanda: z.string(),
    ordine: z.number().int().default(0),
    draftNote: z.string().optional(),
  }),
});

const pagine = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/pagine" }),
  schema: z.object({
    seoTitle: z.string(),
    seoDescription: z.string().max(160),
    titolo: z.string().optional(),
    sottotitolo: z.string().optional(),
    draftNote: z.string().optional(),
  }),
});

export const collections = { aree, faq, pagine };
