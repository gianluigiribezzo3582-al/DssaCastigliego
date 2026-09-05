// Costruisce le risposte della function del form: JSON per l'invio potenziato da
// JavaScript (fetch con Accept: application/json), HTML per la navigazione senza
// JavaScript (redirect 303 sul successo, pagina minimale sull'errore).

export function rispostaSuccesso(vuoleJson: boolean): Response {
  if (vuoleJson) {
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  }
  return new Response(null, {
    status: 303,
    headers: { location: "/contatti/grazie" },
  });
}

export function rispostaErrore(
  vuoleJson: boolean,
  stato: number,
  errori: Record<string, string>,
): Response {
  if (vuoleJson) {
    return new Response(JSON.stringify({ ok: false, errori }), {
      status: stato,
      headers: { "content-type": "application/json" },
    });
  }

  const elenco = Object.values(errori)
    .map((messaggio) => `<li>${escapeHtml(messaggio)}</li>`)
    .join("");

  const html = `<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Impossibile inviare il messaggio</title>
</head>
<body style="font-family: system-ui, sans-serif; max-width: 40rem; margin: 3rem auto; padding: 0 1rem; color: #2E2622;">
<h1>Non è stato possibile inviare il messaggio</h1>
<ul>${elenco}</ul>
<p><a href="/contatti">Torna al modulo di contatto</a></p>
</body>
</html>`;

  return new Response(html, {
    status: stato,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function escapeHtml(testo: string): string {
  return testo
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
