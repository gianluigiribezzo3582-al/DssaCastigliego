import { site } from "../config/site";

/**
 * JSON-LD Psychologist (sottotipo di LocalBusiness). I valori mancanti restano
 * segnaposto: vedi /docs/DA-COMPILARE.md. Va incluso in ogni pagina indicizzabile
 * (lo fa di default src/layouts/Layout.astro).
 */
export function schemaPsychologist(dominio: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Psychologist",
    name: site.nome,
    image: `${dominio}/favicon.svg`,
    url: dominio,
    telephone: site.contatti.telefono,
    email: site.contatti.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.indirizzoStudio.via,
      postalCode: site.indirizzoStudio.cap,
      addressLocality: site.indirizzoStudio.citta,
      addressRegion: site.indirizzoStudio.provincia,
      addressCountry: site.indirizzoStudio.paese,
    },
    areaServed: {
      "@type": "City",
      name: site.citta,
    },
    openingHours: `Mo-Fr ${site.orari.orario}`,
    sameAs: [site.social.linkedin, site.social.instagram].filter(
      (v) => v && !v.startsWith("{{"),
    ),
  };
}

export function schemaFaqPage(
  domande: { domanda: string; risposta: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: domande.map((d) => ({
      "@type": "Question",
      name: d.domanda,
      acceptedAnswer: {
        "@type": "Answer",
        text: d.risposta,
      },
    })),
  };
}

export function schemaBreadcrumb(
  dominio: string,
  voci: { nome: string; percorso: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: voci.map((voce, indice) => ({
      "@type": "ListItem",
      position: indice + 1,
      name: voce.nome,
      item: `${dominio}${voce.percorso}`,
    })),
  };
}
