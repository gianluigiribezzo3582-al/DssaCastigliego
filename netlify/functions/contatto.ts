// Netlify Function del modulo di contatto, su /api/contatto. Tutta la logica è
// condivisa con la versione Cloudflare in functions/_lib/gestore-contatto.ts:
// qui si leggono solo variabili d'ambiente e IP nel formato di Netlify.
//
// Variabili da impostare su Netlify (Site configuration → Environment variables):
// MAIL_DRIVER=brevo, BREVO_API_KEY, BREVO_MITTENTE_EMAIL, BREVO_MITTENTE_NOME,
// DESTINATARIO_EMAIL, RATE_LIMIT_SALT. Vedi /docs/DEPLOY.md.
import { webcrypto } from "node:crypto";
import { gestisciContatto } from "../../functions/_lib/gestore-contatto";
import { rispostaErrore } from "../../functions/_lib/risposte";

// Il rate limit usa la Web Crypto API globale (presente da Node 19 in poi):
// la si rende disponibile anche su runtime più vecchi.
if (!globalThis.crypto) {
  (globalThis as { crypto: unknown }).crypto = webcrypto;
}

export default async (
  request: Request,
  context: { ip?: string },
): Promise<Response> => {
  const env = process.env;

  // In produzione non si ripiega mai sul driver "mock": chi scrive crederebbe
  // di aver inviato un messaggio che invece non arriva da nessuna parte.
  if (env.CONTEXT === "production" && env.MAIL_DRIVER !== "brevo") {
    console.error("[contatto] MAIL_DRIVER=brevo non configurato in produzione");
    const accettaJson = (request.headers.get("accept") ?? "").includes(
      "application/json",
    );
    return rispostaErrore(accettaJson, 503, {
      generale:
        "Il modulo non è al momento disponibile. Scrivi direttamente via email.",
    });
  }

  return gestisciContatto(request, env, context.ip ?? "0.0.0.0");
};

export const config = {
  path: "/api/contatto",
  method: "POST",
};
