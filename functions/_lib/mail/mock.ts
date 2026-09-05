import type { DatiContatto } from "../validazione";
import type { DriverMail, EsitoInvio } from "./tipi";

/**
 * Driver di sviluppo: non invia nessuna email reale, non scrive file, non salva
 * nulla. Stampa in console solo un riepilogo con i campi personali oscurati, utile
 * per verificare che la validazione e l'antispam funzionino durante lo sviluppo
 * senza una chiave Brevo. È il driver di default (MAIL_DRIVER=mock).
 */
export const driverMock: DriverMail = {
  async invia(dati: DatiContatto): Promise<EsitoInvio> {
    console.log(
      "[contatto:mock] nuova richiesta ricevuta (nessun invio reale)",
      {
        nome: `[${dati.nome.length} caratteri]`,
        email: dati.email ? "[presente]" : "[assente]",
        telefono: dati.telefono ? "[presente]" : "[assente]",
        preferenzaContatto: dati.preferenzaContatto,
        disponibilita: dati.disponibilita
          ? `[${dati.disponibilita.length} caratteri]`
          : "[assente]",
        messaggio: `[${dati.messaggio.length} caratteri]`,
      },
    );
    return { ok: true };
  },
};
