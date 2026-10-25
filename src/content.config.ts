import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// Nota per chi lavora dal CMS: i campi "draftNote" servono solo in fase di bozza,
// non vengono mai mostrati in pagina — sono un promemoria interno.

// Le tre sezioni della home (Mi presento, Di cosa mi occupo, La mia formazione).
// Il nome del file (es. "mi-presento") è anche l'ancora della sezione (#mi-presento)
// e il nome della foto da mettere in src/assets/foto/ — vedi src/pages/index.astro.
const sezioni = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/sezioni" }),
  schema: z.object({
    titolo: z.string(),
    ordine: z.number().int().default(0),
    /** Testo alternativo della foto; vuoto = foto puramente decorativa. */
    altFoto: z.string().optional(),
    /** Didascalia facoltativa mostrata sotto la foto (es. titolo e autore di un'opera). */
    didascaliaFoto: z.string().optional(),
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

export const collections = { sezioni, pagine };
