import type { PagesFunction } from "@cloudflare/workers-types";
import { valida } from "../_lib/validazione";
import {
  honeypotCompilato,
  invioTroppoVeloce,
  verificaTurnstile,
} from "../_lib/antispam";
import { hashIp, limiteSuperato } from "../_lib/ratelimit";
import { scegliDriverMail, type EnvMail } from "../_lib/mail";
import { rispostaErrore, rispostaSuccesso } from "../_lib/risposte";

export interface Env extends EnvMail {
  RATE_LIMIT_SALT?: string;
  TURNSTILE_SECRET_KEY?: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

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

  const ip = request.headers.get("cf-connecting-ip") ?? "0.0.0.0";
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

  return rispostaSuccesso(accettaJson);
};
