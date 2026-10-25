// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

// Usato solo in sviluppo locale: in produzione il dominio arriva dall'ambiente
// (vedi sotto). Serve per canonical assoluti, sitemap.xml e Open Graph.
const DOMINIO_SEGNAPOSTO = "https://www.esempio-elisa-castigliego.it";

// https://astro.build/config
// Dominio del sito, in ordine di priorità:
// - SITE_URL: impostato a mano (es. dal workflow di GitHub Pages);
// - URL: impostato automaticamente da Netlify in build, è il dominio principale
//   del sito (quello personalizzato, una volta collegato, es. il dominio Aruba);
// - il segnaposto, solo per lo sviluppo locale.
// BASE_PATH serve solo su GitHub Pages, dove il sito vive in una sottocartella.
export default defineConfig({
  site: process.env.SITE_URL || process.env.URL || DOMINIO_SEGNAPOSTO,
  base: process.env.BASE_PATH || "/",
  output: "static",
  integrations: [
    mdx(),
    sitemap({
      filter: (page) =>
        !page.includes("/admin") && !page.includes("/contatti/grazie"),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
