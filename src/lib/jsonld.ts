import { site } from "../config/site";

interface OpzioniSchema {
  /** URL assoluto della home (tiene conto della base, es. su GitHub Pages). */
  urlHome: string;
  descrizione: string;
  /** URL assoluto della foto di Elisa, se presente; altrimenti l'icona del sito. */
  immagine: string;
}

/**
 * JSON-LD Psychologist (sottotipo di LocalBusiness/MedicalBusiness). Incluso in
 * ogni pagina indicizzabile da src/layouts/Layout.astro. Di proposito senza
 * indirizzo stradale né telefono finché non vengono pubblicati sul sito.
 */
export function schemaPsychologist({
  urlHome,
  descrizione,
  immagine,
}: OpzioniSchema) {
  return {
    "@context": "https://schema.org",
    "@type": "Psychologist",
    "@id": `${urlHome}#studio`,
    name: site.nomeConTitolo,
    description: descrizione,
    image: immagine,
    url: urlHome,
    email: site.contatti.email,
    ...(site.contatti.telefono ? { telephone: site.contatti.telefono } : {}),
    address: {
      "@type": "PostalAddress",
      addressLocality: site.citta,
      addressRegion: site.provincia,
      addressCountry: "IT",
    },
    areaServed: [
      { "@type": "City", name: site.citta },
      { "@type": "City", name: "Bologna" },
    ],
    availableLanguage: "it",
    founder: {
      "@type": "Person",
      name: site.nomeConTitolo,
      jobTitle: site.titoloProfessionale,
      honorificPrefix: "Dott.ssa",
      email: site.contatti.email,
    },
    sameAs: [site.social.linkedin, site.social.instagram].filter(Boolean),
  };
}

export function schemaWebSite(urlHome: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${urlHome}#sito`,
    url: urlHome,
    name: site.nomeConTitolo,
    inLanguage: "it-IT",
    publisher: { "@id": `${urlHome}#studio` },
  };
}
