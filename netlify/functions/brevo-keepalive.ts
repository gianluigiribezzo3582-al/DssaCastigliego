// Netlify Scheduled Function: una volta a settimana fa una richiesta di sola
// lettura all'API di Brevo (statistiche delle email transazionali), così la
// chiave API non risulta mai "inutilizzata" e non scade dopo 90 giorni senza
// messaggi dal modulo. Non invia email e non modifica nulla.
//
// Usa solo il permesso già dato alla chiave ("Email transazionali: Tutti").
// Netlify esegue le funzioni pianificate solo sul deploy pubblicato.

const URL_BREVO =
  "https://api.brevo.com/v3/smtp/statistics/aggregatedReport?days=1";

export default async (): Promise<Response> => {
  const chiave = process.env.BREVO_API_KEY;

  if (process.env.MAIL_DRIVER !== "brevo" || !chiave) {
    console.log("[brevo-keepalive] Brevo non configurato: nessuna richiesta");
    return new Response("non configurato", { status: 200 });
  }

  try {
    const risposta = await fetch(URL_BREVO, {
      headers: { accept: "application/json", "api-key": chiave },
    });
    if (!risposta.ok) {
      // Visibile in Netlify → Logs → Functions → brevo-keepalive.
      console.error(
        `[brevo-keepalive] Brevo ha risposto ${risposta.status}: la chiave potrebbe essere scaduta o senza permessi`,
      );
      return new Response("errore", { status: 502 });
    }
    console.log("[brevo-keepalive] chiave API attiva");
    return new Response("ok", { status: 200 });
  } catch (err) {
    console.error("[brevo-keepalive] richiesta non riuscita", err);
    return new Response("errore", { status: 502 });
  }
};

export const config = {
  schedule: "@weekly",
};
