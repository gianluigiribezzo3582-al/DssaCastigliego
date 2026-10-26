// Configurazione centrale del sito.
//
// I dati che Elisa può modificare da sola (contatti, località, dati dell'Ordine/P.IVA,
// numeri di emergenza) vivono in src/content/dati-sito.json e sono editabili dal CMS
// su /admin ("Contatti e dati dello studio"). Qui restano i valori strutturali
// (nome, titolo). Il dominio è in astro.config.mjs.
import datiSito from "../content/dati-sito.json";

export const site = {
  nome: "Elisa Castigliego",
  nomeConTitolo: "Dott.ssa Elisa Castigliego",
  titoloProfessionale: "Psicologa",
  citta: "San Lazzaro di Savena",
  provincia: "BO",
  // Testo mostrato al posto dell'indirizzo dello studio (che di proposito non
  // compare sul sito).
  localita: datiSito.localita,
  titolareTrattamento: "Elisa Castigliego",

  albo: datiSito.albo,
  partitaIva: datiSito.partitaIva,

  // telefono e whatsappNumero sono vuoti finché non c'è un numero dello studio:
  // quando sono vuoti non compaiono da nessuna parte del sito.
  contatti: {
    email: datiSito.contatti.email,
    pec: datiSito.contatti.pec,
    telefono: datiSito.contatti.telefono.trim(),
    whatsappNumero: datiSito.contatti.whatsappNumero.trim(),
  },
  social: datiSito.social,
  informativaPrivacy: datiSito.informativaPrivacy,

  emergenze: {
    numeroUnicoEmergenze: "112",
    // Numeri di supporto nazionali: NON inventati né cercati in autonomia, vedi
    // /docs/BLOCCHI.md. Editabili dal CMS insieme al resto di dati-sito.json.
    numeriSupporto: datiSito.emergenze.numeriSupporto,
  },
} as const;

/** Dicitura completa dell'iscrizione all'Ordine, usata in footer e note legali. */
export const iscrizioneOrdine = `Iscrizione Ordine degli Psicologi dell'${site.albo.regione} n. ${site.albo.numero}`;

/** Link "tel:" del telefono dello studio (solo cifre e +), oppure null se assente. */
export const telefonoHref = site.contatti.telefono
  ? `tel:${site.contatti.telefono.replace(/[^\d+]/g, "")}`
  : null;

/** Link wa.me precompilato, oppure null se il numero WhatsApp non è impostato. */
export const whatsappHref = site.contatti.whatsappNumero
  ? `https://wa.me/${site.contatti.whatsappNumero}?text=${encodeURIComponent(
      "Buongiorno, ho visto il sito e vorrei informazioni su un appuntamento.",
    )}`
  : null;

export type Site = typeof site;
