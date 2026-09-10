import type { DatiContatto } from "../validazione";

/**
 * Testo dell'email che partirebbe per una nuova richiesta dal modulo di contatto.
 * Condiviso tra il driver "brevo" (per l'invio reale) e il driver "mock" (che lo
 * restituisce al browser come anteprima, senza inviarlo davvero — vedi mock.ts).
 */
export function testoEmail(dati: DatiContatto): string {
  const contattoPreferito = {
    email: "email",
    telefono: "telefono",
    whatsapp: "WhatsApp",
  }[dati.preferenzaContatto];

  return [
    `Nuova richiesta dal modulo di contatto del sito.`,
    ``,
    `Nome/identificativo: ${dati.nome}`,
    dati.email ? `Email: ${dati.email}` : null,
    dati.telefono ? `Telefono: ${dati.telefono}` : null,
    `Preferenza di contatto: ${contattoPreferito}`,
    dati.disponibilita ? `Disponibilità indicata: ${dati.disponibilita}` : null,
    ``,
    `Messaggio:`,
    dati.messaggio,
  ]
    .filter((riga) => riga !== null)
    .join("\n");
}
