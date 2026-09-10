import type { DatiContatto } from "../validazione";
import type { DriverMail, EsitoInvio } from "./tipi";
import { testoEmail } from "./formato";

/**
 * Driver di sviluppo: non invia nessuna email reale, non scrive file, non salva
 * nulla. Stampa in console solo un riepilogo con i campi personali oscurati (per
 * i log del server — potenzialmente letti da altri, mai da associare al
 * contenuto in chiaro). Restituisce invece al chiamante il testo completo
 * dell'email che sarebbe partita: questo torna solo alla stessa persona/browser
 * che ha appena compilato il form (non viene loggato né salvato da nessuna
 * parte), utile per mostrare un'anteprima realistica in una demo. È il driver
 * di default (MAIL_DRIVER=mock).
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
    return { ok: true, anteprimaEmail: testoEmail(dati) };
  },
};
