import type { PagesFunction } from "@cloudflare/workers-types";

export interface Env {
  ADMIN_BASIC_AUTH_USER?: string;
  ADMIN_BASIC_AUTH_PASS?: string;
}

/**
 * Protegge /admin (e ogni sotto-percorso, es. /admin/guida) con una password
 * (HTTP Basic Auth), così un estraneo che indovina l'indirizzo non può aprire
 * l'interfaccia di redazione. Si applica anche alla build statica, non solo
 * alle Function: in Cloudflare Pages il middleware intercetta ogni richiesta,
 * pagine statiche comprese.
 *
 * ATTIVO SOLO SE sono impostate entrambe le variabili d'ambiente
 * ADMIN_BASIC_AUTH_USER e ADMIN_BASIC_AUTH_PASS. Di default (repository appena
 * clonato, sviluppo locale) non sono impostate: /admin resta raggiungibile
 * come prima. Vanno impostate come secret su Cloudflare Pages prima di andare
 * online — vedi /docs/DEPLOY.md.
 *
 * Nota: Basic Auth è una barriera semplice, non un vero sistema di identità:
 * la password è condivisa e non scade da sola. Per una protezione più solida
 * (login individuale, revoca accessi, log) la scelta consigliata resta
 * Cloudflare Access, descritta anch'essa in /docs/DEPLOY.md — le due cose non
 * si escludono, Basic Auth è già attivabile oggi senza creare nessun account.
 */
export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, next, env } = context;
  const url = new URL(request.url);

  if (!url.pathname.startsWith("/admin")) {
    return next();
  }

  const utente = env.ADMIN_BASIC_AUTH_USER;
  const password = env.ADMIN_BASIC_AUTH_PASS;

  if (!utente || !password) {
    return next();
  }

  const intestazione = request.headers.get("authorization") ?? "";
  const atteso = `Basic ${btoa(`${utente}:${password}`)}`;

  if (intestazione !== atteso) {
    return new Response("Accesso riservato.", {
      status: 401,
      headers: {
        "www-authenticate": 'Basic realm="Area riservata", charset="UTF-8"',
        "content-type": "text/plain; charset=utf-8",
      },
    });
  }

  return next();
};
