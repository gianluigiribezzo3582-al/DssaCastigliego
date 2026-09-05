import type { DatiContatto } from "../validazione";
import type { DriverMail, EsitoInvio } from "./tipi";

export interface ConfigurazioneBrevo {
  apiKey: string;
  mittenteEmail: string;
  mittenteNome: string;
  destinatarioEmail: string;
}

function testoEmail(dati: DatiContatto): string {
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

/**
 * Driver di produzione: invia l'email tramite l'API transazionale di Brevo.
 * Va usato solo con MAIL_DRIVER=brevo e una BREVO_API_KEY reale (non presente in
 * questo repository). Nessuna persistenza: se l'invio fallisce, l'errore viene
 * restituito al chiamante senza salvare il messaggio da nessuna parte.
 */
export function creaDriverBrevo(config: ConfigurazioneBrevo): DriverMail {
  return {
    async invia(dati: DatiContatto): Promise<EsitoInvio> {
      try {
        const risposta = await fetch("https://api.brevo.com/v3/smtp/email", {
          method: "POST",
          headers: {
            accept: "application/json",
            "content-type": "application/json",
            "api-key": config.apiKey,
          },
          body: JSON.stringify({
            sender: { email: config.mittenteEmail, name: config.mittenteNome },
            to: [{ email: config.destinatarioEmail }],
            replyTo: dati.email
              ? { email: dati.email, name: dati.nome }
              : undefined,
            subject: `Nuova richiesta dal sito — ${dati.nome}`,
            textContent: testoEmail(dati),
          }),
        });

        if (!risposta.ok) {
          return {
            ok: false,
            errore: `Brevo ha risposto con stato ${risposta.status}`,
          };
        }

        return { ok: true };
      } catch (err) {
        return {
          ok: false,
          errore: err instanceof Error ? err.message : "Errore sconosciuto",
        };
      }
    },
  };
}
