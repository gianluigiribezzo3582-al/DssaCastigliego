// Antispam senza servizi esterni: honeypot + time-trap.
// Il punto di innesto per Cloudflare Turnstile è predisposto più sotto, non attivo:
// vedi TURNSTILE_SECRET_KEY in .dev.vars.example e /docs/BLOCCHI.md.

/** Nome del campo honeypot: un campo che un utente umano non vede e non compila. */
export const CAMPO_HONEYPOT = "sito_web_personale";

/** Nome del campo che porta il timestamp di caricamento del form (impostato via JS). */
export const CAMPO_TIMESTAMP = "carica_ts";

/** Tempo minimo, in millisecondi, che deve intercorrere tra caricamento e invio. */
const SOGLIA_TIME_TRAP_MS = 4000;

export function honeypotCompilato(formData: FormData): boolean {
  const valore = formData.get(CAMPO_HONEYPOT);
  return typeof valore === "string" && valore.trim().length > 0;
}

/**
 * Restituisce true se l'invio è troppo veloce per essere plausibilmente umano.
 * Se il timestamp non è presente (navigazione senza JavaScript), il controllo
 * viene saltato: non è possibile valutarlo, e l'honeypot + il rate limit restano
 * comunque attivi come barriere. Vedi /docs/DECISIONI.md.
 */
export function invioTroppoVeloce(formData: FormData, adesso: number): boolean {
  const raw = formData.get(CAMPO_TIMESTAMP);
  if (typeof raw !== "string" || raw.trim() === "") return false;

  const caricatoAlle = Number(raw);
  if (!Number.isFinite(caricatoAlle)) return false;

  return adesso - caricatoAlle < SOGLIA_TIME_TRAP_MS;
}

/**
 * Punto di innesto per Cloudflare Turnstile — NON attivo. Se in futuro si imposta
 * TURNSTILE_SECRET_KEY, questa funzione va richiamata dall'handler principale con
 * il token inviato dal widget lato client (non ancora presente nel markup).
 */
export async function verificaTurnstile(
  secretKey: string | undefined,
  token: string | null,
  ip: string,
): Promise<boolean> {
  if (!secretKey) return true; // Turnstile disattivato: nessun controllo aggiuntivo
  if (!token) return false;

  const risposta = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        secret: secretKey,
        response: token,
        remoteip: ip,
      }),
    },
  );
  const esito = (await risposta.json()) as { success: boolean };
  return esito.success === true;
}
