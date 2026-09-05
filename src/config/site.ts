// Configurazione centrale del sito.
//
// I dati che Elisa può modificare da sola (contatti, indirizzo, social, orari, dati
// dell'Albo/P.IVA, numeri di emergenza) vivono in src/content/dati-sito.json e sono
// editabili dal CMS su /admin ("Configurazione sito" e "Dati di contatto"). I valori
// più strutturali (nome, dominio...) restano qui perché richiedono anche modifiche al
// codice per essere cambiati (es. il dominio è usato anche in astro.config.mjs).
//
// Tutti i valori marcati come segnaposto sono FALSI e vanno sostituiti prima della
// pubblicazione. Vedi /docs/DA-COMPILARE.md per la checklist completa.
import datiSito from "../content/dati-sito.json";

export const site = {
  nome: "Elisa Castigliego",
  titoloProfessionale: "Psicologa",
  citta: "Bologna",
  titolareTrattamento: "Elisa Castigliego",

  albo: datiSito.albo,
  partitaIva: datiSito.partitaIva,
  codiceFiscale: datiSito.codiceFiscale,

  indirizzoStudio: {
    ...datiSito.indirizzoStudio,
    citta: "Bologna",
    provincia: "BO",
    paese: "IT",
  },

  contatti: datiSito.contatti,
  social: datiSito.social,
  orari: datiSito.orari,
  informativaPrivacy: datiSito.informativaPrivacy,

  // SEGNAPOSTO: dominio reale del sito, usato anche in astro.config.mjs.
  // Cambiarlo in entrambi i punti prima della pubblicazione — vedi /docs/DA-COMPILARE.md.
  dominio: "https://www.esempio-elisa-castigliego.it",

  emergenze: {
    numeroUnicoEmergenze: "112",
    // Numeri di supporto nazionali: NON inventati né cercati in autonomia, vedi
    // /docs/BLOCCHI.md. Editabili dal CMS insieme al resto di dati-sito.json.
    numeriSupporto: datiSito.emergenze.numeriSupporto,
  },
} as const;

export type Site = typeof site;
