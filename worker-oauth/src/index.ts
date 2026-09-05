// Worker Cloudflare per l'autenticazione GitHub di Sveltia CMS (compatibile col
// protocollo OAuth "popup" usato anche da Decap CMS).
//
// NON è collegato a nessuna GitHub App: le variabili GITHUB_CLIENT_ID e
// GITHUB_CLIENT_SECRET non sono impostate in questo repository. Il codice è
// completo e pronto da pubblicare (`wrangler deploy` da questa cartella) non
// appena la GitHub App esiste — procedura passo-passo in /docs/CMS.md.
//
// Flusso:
//  1. GET /auth              -> redirige a GitHub per l'autorizzazione
//  2. GET /callback?code=... -> scambia il code per un token e lo passa alla
//                                finestra del CMS via postMessage
//  3. GET /                  -> pagina di stato minimale, utile per verificare
//                                che il worker sia raggiungibile

export interface Env {
  GITHUB_CLIENT_ID?: string;
  GITHUB_CLIENT_SECRET?: string;
  // Elenco separato da virgole delle origini ammesse a ricevere il token
  // (il dominio del sito su cui gira /admin). Obbligatorio in produzione:
  // senza restrizione, chiunque potrebbe intercettare il token via postMessage.
  ALLOWED_ORIGINS?: string;
}

const GITHUB_AUTHORIZE_URL = "https://github.com/login/oauth/authorize";
const GITHUB_TOKEN_URL = "https://github.com/login/oauth/access_token";

function origniAmmesse(env: Env): string[] {
  return (env.ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);
}

function generaStato(): string {
  return crypto.randomUUID();
}

async function gestisciAuth(request: Request, env: Env): Promise<Response> {
  if (!env.GITHUB_CLIENT_ID) {
    return new Response(
      "GITHUB_CLIENT_ID non configurato. Vedi /docs/CMS.md.",
      {
        status: 500,
      },
    );
  }

  const url = new URL(request.url);
  const redirectUri = `${url.origin}/callback`;
  const stato = generaStato();

  const destinazione = new URL(GITHUB_AUTHORIZE_URL);
  destinazione.searchParams.set("client_id", env.GITHUB_CLIENT_ID);
  destinazione.searchParams.set("redirect_uri", redirectUri);
  destinazione.searchParams.set("scope", "repo,user");
  destinazione.searchParams.set("state", stato);

  const risposta = Response.redirect(destinazione.toString(), 302);
  // Lo stato viene verificato al ritorno leggendo lo stesso cookie: mitiga il CSRF
  // sul flusso OAuth senza bisogno di storage lato server.
  const headers = new Headers(risposta.headers);
  headers.append(
    "set-cookie",
    `oauth_state=${stato}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
  );
  return new Response(null, { status: 302, headers });
}

function leggiCookie(request: Request, nome: string): string | null {
  const intestazione = request.headers.get("cookie") ?? "";
  const match = intestazione
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${nome}=`));
  return match ? match.split("=")[1] : null;
}

function paginaPostMessage(
  esito: "success" | "error",
  payload: unknown,
  origini: string[],
): Response {
  const messaggio = `authorization:github:${esito}:${JSON.stringify(payload)}`;
  // In assenza di un'origine configurata, il messaggio viene inviato solo alla
  // finestra che ha aperto il popup, tramite "*" limitato dal fatto che il
  // popup è stato aperto proprio da quella pagina: per produzione va comunque
  // impostata ALLOWED_ORIGINS con il dominio reale del sito.
  const targetOrigin = origini[0] ?? "*";

  const html = `<!doctype html>
<html lang="it">
<head><meta charset="utf-8"><title>Autenticazione CMS</title></head>
<body>
<script>
  function invia() {
    window.opener.postMessage(${JSON.stringify(messaggio)}, ${JSON.stringify(targetOrigin)});
  }
  if (window.opener) {
    invia();
    window.addEventListener("message", function (e) {
      if (e.data === "authorizing:github") invia();
    });
  }
</script>
<p>Puoi chiudere questa finestra.</p>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

async function gestisciCallback(request: Request, env: Env): Promise<Response> {
  const origini = origniAmmesse(env);
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const stato = url.searchParams.get("state");
  const statoAtteso = leggiCookie(request, "oauth_state");

  if (!code || !stato || stato !== statoAtteso) {
    return paginaPostMessage(
      "error",
      { message: "Stato OAuth non valido." },
      origini,
    );
  }

  if (!env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET) {
    return paginaPostMessage(
      "error",
      { message: "Worker non configurato (client id/secret mancanti)." },
      origini,
    );
  }

  const rispostaToken = await fetch(GITHUB_TOKEN_URL, {
    method: "POST",
    headers: { accept: "application/json", "content-type": "application/json" },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
    }),
  });

  const corpo = (await rispostaToken.json()) as {
    access_token?: string;
    error?: string;
    error_description?: string;
  };

  if (!corpo.access_token) {
    return paginaPostMessage(
      "error",
      { message: corpo.error_description ?? "Scambio del token non riuscito." },
      origini,
    );
  }

  return paginaPostMessage(
    "success",
    { token: corpo.access_token, provider: "github" },
    origini,
  );
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/auth") return gestisciAuth(request, env);
    if (url.pathname === "/callback") return gestisciCallback(request, env);

    if (url.pathname === "/") {
      return new Response(
        "Worker OAuth per Sveltia CMS attivo. Endpoint: /auth, /callback. Vedi /docs/CMS.md.",
        { headers: { "content-type": "text/plain; charset=utf-8" } },
      );
    }

    return new Response("Non trovato", { status: 404 });
  },
};
