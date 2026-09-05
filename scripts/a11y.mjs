// Esegue un audit automatico di accessibilità (pa11y, motore axe) su tutte le rotte
// pubbliche del sito, contro la build di produzione servita da `astro preview`.
// Uso: npm run a11y  (esegue prima `npm run build`)
// Alla prima esecuzione pa11y scarica Chromium: richiede una connessione di rete.
import { spawn } from "node:child_process";
import { writeFile } from "node:fs/promises";
import pa11y from "pa11y";

const PORT = 4322;
const BASE_URL = `http://127.0.0.1:${PORT}`;

const ROTTE = [
  "/",
  "/chi-sono",
  "/aree-di-intervento",
  "/aree-di-intervento/ansia",
  "/come-lavoro",
  "/faq",
  "/contatti",
  "/emergenze",
  "/privacy",
  "/cookie-policy",
  "/note-legali",
];

function attendiServer(url, timeoutMs = 30000) {
  const scadenza = Date.now() + timeoutMs;
  return new Promise((resolve, reject) => {
    const prova = async () => {
      try {
        const res = await fetch(url);
        if (res.ok) return resolve();
      } catch {
        // server non ancora pronto
      }
      if (Date.now() > scadenza)
        return reject(new Error("Timeout avvio server di preview"));
      setTimeout(prova, 500);
    };
    prova();
  });
}

async function main() {
  const server = spawn("npx", ["astro", "preview", "--port", String(PORT)], {
    stdio: "ignore",
    shell: true,
  });

  try {
    await attendiServer(BASE_URL);

    const risultati = [];
    for (const rotta of ROTTE) {
      const risultato = await pa11y(`${BASE_URL}${rotta}`, {
        standard: "WCAG2AA",
      });
      risultati.push({ rotta, issues: risultato.issues });
      console.log(`${rotta}: ${risultato.issues.length} problemi rilevati`);
    }

    const totale = risultati.reduce((acc, r) => acc + r.issues.length, 0);
    const righe = [
      "# Accessibilità — risultato audit automatico (pa11y / axe)",
      "",
      `Eseguito il ${new Date().toISOString()}. Problemi totali rilevati: ${totale}.`,
      "",
    ];

    for (const { rotta, issues } of risultati) {
      righe.push(`## ${rotta}`);
      if (issues.length === 0) {
        righe.push("", "Nessun problema rilevato.", "");
        continue;
      }
      for (const issue of issues) {
        righe.push(
          `- **${issue.type}** (${issue.code}): ${issue.message} — \`${issue.selector}\``,
        );
      }
      righe.push("");
    }

    await writeFile(
      new URL("../docs/ACCESSIBILITY-AUTO.md", import.meta.url),
      righe.join("\n"),
      "utf-8",
    );
    console.log("\nRisultato completo salvato in docs/ACCESSIBILITY-AUTO.md");
  } finally {
    server.kill();
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
