// Controllo HTTP Basic Auth per /admin, condiviso tra il middleware di
// Cloudflare Pages (functions/_middleware.ts) e la Edge Function di Netlify
// (netlify/edge-functions/proteggi-admin.ts).

/**
 * Restituisce una risposta 401 se la richiesta a /admin non porta le credenziali
 * giuste, oppure null se può proseguire (rotta pubblica, credenziali corrette o
 * protezione non configurata).
 */
export function controllaAccessoAdmin(
  request: Request,
  utente: string | undefined,
  password: string | undefined,
): Response | null {
  const url = new URL(request.url);
  if (!url.pathname.startsWith("/admin")) return null;
  if (!utente || !password) return null;

  const intestazione = request.headers.get("authorization") ?? "";
  const atteso = `Basic ${btoa(`${utente}:${password}`)}`;
  if (intestazione === atteso) return null;

  return new Response("Accesso riservato.", {
    status: 401,
    headers: {
      "www-authenticate": 'Basic realm="Area riservata", charset="UTF-8"',
      "content-type": "text/plain; charset=utf-8",
    },
  });
}
