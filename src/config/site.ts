// Configurazione centrale del sito.
// Tutti i valori marcati come segnaposto sono FALSI e vanno sostituiti
// prima della pubblicazione. Vedi /docs/DA-COMPILARE.md per la checklist completa.

export const site = {
  nome: "Elisa Castigliego",
  titoloProfessionale: "Psicologa",
  citta: "Bologna",

  // Titolare del trattamento (per privacy policy e JSON-LD)
  titolareTrattamento: "Elisa Castigliego",

  // --- SEGNAPOSTO: dati professionali reali, non inventati ---
  albo: {
    regione: "{{ALBO_REGIONE}}",
    numero: "{{ALBO_NUMERO}}",
  },
  partitaIva: "{{PARTITA_IVA}}",
  codiceFiscale: "{{CODICE_FISCALE}}",

  indirizzoStudio: {
    via: "{{INDIRIZZO_STUDIO_VIA}}",
    cap: "{{INDIRIZZO_STUDIO_CAP}}",
    citta: "Bologna",
    provincia: "BO",
    paese: "IT",
  },

  contatti: {
    email: "{{EMAIL_CONTATTO}}",
    telefono: "{{TELEFONO_CONTATTO}}",
    whatsappNumero: "{{WHATSAPP_NUMERO}}", // formato internazionale senza '+', es. 393331234567
  },

  social: {
    linkedin: "{{URL_LINKEDIN}}",
    instagram: "{{URL_INSTAGRAM}}",
  },

  orari: {
    // usati nel JSON-LD Psychologist/LocalBusiness — segnaposto, da confermare
    giorni: "Lunedì – Venerdì",
    orario: "{{ORARIO_APERTURA}} - {{ORARIO_CHIUSURA}}",
  },

  informativaPrivacy: {
    versione: "0.1-bozza",
    dataAggiornamento: "{{DATA_AGGIORNAMENTO_PRIVACY}}",
  },

  dominio: "{{DOMINIO_SITO}}", // es. https://www.esempio.it — usato per canonical, sitemap, OG

  emergenze: {
    numeroUnicoEmergenze: "112",
    // Numeri di supporto nazionali: NON inventare né cercare in autonomia.
    // Segnaposto da verificare e inserire da parte della cliente/sviluppatore umano.
    numeriSupporto: [
      { nome: "{{NOME_SERVIZIO_SUPPORTO_1}}", numero: "{{NUMERO_SUPPORTO_1}}" },
      { nome: "{{NOME_SERVIZIO_SUPPORTO_2}}", numero: "{{NUMERO_SUPPORTO_2}}" },
    ],
  },
} as const;

export type Site = typeof site;
