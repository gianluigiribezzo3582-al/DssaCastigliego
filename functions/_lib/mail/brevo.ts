import type { DatiContatto } from "../validazione";
import type { DriverMail, EsitoInvio } from "./tipi";
import { testoEmail } from "./formato";

export interface ConfigurazioneBrevo {
  apiKey: string;
  mittenteEmail: string;
  mittenteNome: string;
  destinatarioEmail: string;
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
