// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

// SEGNAPOSTO: sostituire con il dominio reale prima della pubblicazione
// (usato per canonical assoluti, sitemap.xml e Open Graph). Vedi /docs/DA-COMPILARE.md.
const DOMINIO_SEGNAPOSTO = "https://www.esempio-elisa-castigliego.it";

// https://astro.build/config
// SITE_URL e BASE_PATH vengono impostati dal workflow di GitHub Pages
// (.github/workflows/deploy-pages.yml): lì il sito vive in una sottocartella
// (es. /DssaCastigliego/). Altrove (sviluppo, Cloudflare Pages, dominio proprio)
// restano vuoti e il sito sta alla radice.
export default defineConfig({
  site: process.env.SITE_URL || DOMINIO_SEGNAPOSTO,
  base: process.env.BASE_PATH || "/",
  output: "static",
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !page.includes("/admin"),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
