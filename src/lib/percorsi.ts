/**
 * Percorso interno che tiene conto della `base` di Astro: su GitHub Pages il sito
 * vive in una sottocartella (es. /DssaCastigliego/), su un dominio proprio o su
 * Cloudflare Pages alla radice. Usare sempre questa funzione per i link interni
 * invece di scrivere "/contatti" a mano. Vedi astro.config.mjs.
 */
export function percorso(p: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  return `${base}${p}`;
}
