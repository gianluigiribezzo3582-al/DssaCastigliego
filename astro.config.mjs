// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

// Dominio ufficiale del sito, usato per canonical assoluti, sitemap.xml,
// robots.txt e Open Graph. SITE_URL lo sostituisce solo per la copia di
// anteprima su GitHub Pages (vedi il workflow), dove BASE_PATH indica anche la
// sottocartella in cui vive il sito.
const DOMINIO_SITO = "https://www.elisacastigliegopsicologa.it";

// https://astro.build/config
export default defineConfig({
  site: process.env.SITE_URL || DOMINIO_SITO,
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
