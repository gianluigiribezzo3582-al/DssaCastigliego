import { site } from "../config/site";

/**
 * JSON-LD Psychologist (sottotipo di LocalBusiness). Va incluso in ogni pagina indicizzabile
 * (lo fa di default src/layouts/Layout.astro).
 */
export function schemaPsychologist(dominio: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Psychologist",
    name: site.nomeConTitolo,
    image: `${dominio}/favicon.svg`,
    url: dominio,
    ...(site.contatti.telefono ? { telephone: site.contatti.telefono } : {}),
    email: site.contatti.email,
    // Solo la località: l'indirizzo dello studio non è pubblicato sul sito.
    address: {
      "@type": "PostalAddress",
      addressLocality: site.citta,
      addressRegion: site.provincia,
      addressCountry: "IT",
    },
    areaServed: {
      "@type": "City",
      name: site.citta,
    },
    sameAs: [site.social.linkedin, site.social.instagram].filter(
      (v) => v && !v.startsWith("{{"),
    ),
  };
}
