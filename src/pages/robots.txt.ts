import type { APIRoute } from "astro";
import { percorso } from "../lib/percorsi";

// robots.txt generato in build, così l'indirizzo della sitemap segue sempre il
// dominio reale (su Netlify viene dalla variabile URL, vedi astro.config.mjs).
// Tutti i bot sono ammessi, inclusi quelli dei servizi di IA (scelta esplicita).
// Con PUBLIC_NOINDEX=on (build di anteprima) blocca tutto.
export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL(percorso("/sitemap-index.xml"), site).href;
  const righe =
    import.meta.env.PUBLIC_NOINDEX === "on"
      ? ["User-agent: *", "Disallow: /"]
      : [
          "User-agent: *",
          "Allow: /",
          `Disallow: ${percorso("/admin/")}`,
          `Disallow: ${percorso("/contatti/grazie/")}`,
          "",
          `Sitemap: ${sitemap}`,
        ];
  return new Response(righe.join("\n") + "\n", {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
