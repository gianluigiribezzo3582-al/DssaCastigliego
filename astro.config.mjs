// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

// SEGNAPOSTO: sostituire con il dominio reale prima della pubblicazione
// (usato per canonical assoluti, sitemap.xml e Open Graph). Vedi /docs/DA-COMPILARE.md.
const DOMINIO_SEGNAPOSTO = "https://www.esempio-elisa-castigliego.it";

// https://astro.build/config
export default defineConfig({
  site: DOMINIO_SEGNAPOSTO,
  output: "static",
  integrations: [
    mdx(),
    sitemap({
      filter: (page) =>
        !page.includes("/admin") && !page.includes("/demo-prenotazione"),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
