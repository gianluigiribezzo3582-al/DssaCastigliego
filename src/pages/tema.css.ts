import type { APIRoute } from "astro";
import scelti from "../content/tema.json";
import { cssTema, risolviTema } from "../lib/tema";

// /tema.css: i colori scelti nel CMS diventano un foglio di stile statico in
// build. Le eventuali correzioni per leggibilità finiscono nel log di build.
export const GET: APIRoute = () => {
  const esito = risolviTema(scelti);
  for (const avviso of esito.avvisi) console.warn(`[tema] ${avviso}`);
  return new Response(cssTema(esito), {
    headers: { "Content-Type": "text/css; charset=utf-8" },
  });
};
