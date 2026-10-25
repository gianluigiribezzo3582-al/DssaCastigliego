// Logica del modulo di contatto, indipendente dalla piattaforma: la usano sia la
// Cloudflare Pages Function (functions/api/contatto.ts) sia la Netlify Function
// (netlify/functions/contatto.ts), che cambiano solo il modo di leggere le
// variabili d'ambiente e l'indirizzo IP.
import { valida } from "./validazione";
import {
  honeypotCompilato,
  invioTroppoVeloce,
  verificaTurnstile,
} from "./antispam";
import { hashIp, limiteSuperato } from "./ratelimit";
import { scegliDriverMail, type EnvMail } from "./mail";
import { rispostaErrore, rispostaSuccesso } from "./risposte";

export interface EnvContatto extends EnvMail {
  RATE_LIMIT_SALT?: string;
  TURNSTILE_SECRET_KEY?: string;
}

export async function gestisciContatto(
  request: Request,
  env: EnvContatto,
  ip: string,
): Promise<Response> {
  const accettaJson = (request.headers.get("accept") ?? "").includes(
    "application/json",
  );

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return rispostaErrore(accettaJson, 400, {
      generale: "Richiesta non valida.",
    });
  }

  // Honeypot: se compilato, si finge un successo per non rivelare la tecnica ai bot,
  // ma non si invia nulla e non si registra nulla.
  if (honeypotCompilato(formData)) {
    return rispostaSuccesso(accettaJson);
  }

  if (invioTroppoVeloce(formData, Date.now())) {
    return rispostaErrore(accettaJson, 400, {
      generale:
        "L'invio è arrivato troppo rapidamente. Ricarica la pagina e riprova.",
    });
  }

  const sale = env.RATE_LIMIT_SALT ?? "sale-di-sviluppo-non-sicuro";
  const chiaveRateLimit = await hashIp(ip, sale);
  if (limiteSuperato(chiaveRateLimit)) {
    return rispostaErrore(accettaJson, 429, {
      generale: "Troppe richieste in poco tempo. Riprova tra qualche minuto.",
    });
  }

  // Punto di innesto Turnstile: attivo solo se TURNSTILE_SECRET_KEY è impostata
  // (oggi non lo è mai, vedi /docs/BLOCCHI.md). Senza chiave, la verifica passa sempre.
  const turnstileOk = await verificaTurnstile(
    env.TURNSTILE_SECRET_KEY,
    formData.get("cf-turnstile-response") as string | null,
    ip,
  );
  if (!turnstileOk) {
    return rispostaErrore(accettaJson, 400, {
      generale: "Verifica antispam non superata. Riprova.",
    });
  }

  const esito = valida(formData);
  if (!esito.ok) {
    return rispostaErrore(accettaJson, 400, esito.errori);
  }

  let driver;
  try {
    driver = scegliDriverMail(env);
  } catch (err) {
    console.error("[contatto] configurazione mail non valida", err);
    return rispostaErrore(accettaJson, 500, {
      generale:
        "Il servizio non è configurato correttamente. Riprova più tardi.",
    });
  }

  const esitoInvio = await driver.invia(esito.dati!);
  if (!esitoInvio.ok) {
    console.error("[contatto] invio non riuscito", esitoInvio.errore);
    return rispostaErrore(accettaJson, 502, {
      generale:
        "Non è stato possibile inviare il messaggio. Riprova più tardi o scrivi via email.",
    });
  }

  // anteprimaEmail è valorizzata solo dal driver "mock" (mai da "brevo"): torna
  // solo alla stessa persona che ha appena inviato il modulo, non viene salvata
  // né loggata. Vedi functions/_lib/mail/mock.ts.
  return rispostaSuccesso(
    accettaJson,
    esitoInvio.anteprimaEmail
      ? { anteprimaEmail: esitoInvio.anteprimaEmail }
      : undefined,
  );
}
