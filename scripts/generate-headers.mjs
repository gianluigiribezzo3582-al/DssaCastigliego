// Genera dist/_headers dopo la build. Per ogni pagina calcola gli hash SHA-256
// esatti degli script inline (i blocchi JSON-LD) e li usa in una Content-Security-Policy
// restrittiva, invece di indebolirla con 'unsafe-inline'. Nessuna terza parte è mai
// ammessa: ogni direttiva è limitata a 'self' (più gli hash inline necessari).
import { createHash } from "node:crypto";
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const qui = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(qui, "../dist");

const INTESTAZIONI_COMUNI = [
  "X-Content-Type-Options: nosniff",
  "Referrer-Policy: strict-origin-when-cross-origin",
  "X-Frame-Options: DENY",
  "Permissions-Policy: geolocation=(), microphone=(), camera=(), payment=(), usb=(), interest-cohort=()",
  "Strict-Transport-Security: max-age=31536000",
];

function elencaFileHtml(dir) {
  const risultato = [];
  for (const voce of readdirSync(dir)) {
    const completo = path.join(dir, voce);
    if (statSync(completo).isDirectory()) {
      risultato.push(...elencaFileHtml(completo));
    } else if (voce.endsWith(".html")) {
      risultato.push(completo);
    }
  }
  return risultato;
}

/** Estrae il contenuto testuale di ogni <script> senza attributo src (JSON-LD incluso). */
function estraiScriptInline(html) {
  const risultati = [];
  const regex = /<script(?![^>]*\ssrc=)[^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = regex.exec(html))) {
    if (match[1].trim().length > 0) risultati.push(match[1]);
  }
  return risultati;
}

function hashSha256Base64(testo) {
  return createHash("sha256").update(testo, "utf-8").digest("base64");
}

function percorsoPubblico(fileHtml) {
  const relativo = path.relative(DIST, fileHtml).split(path.sep).join("/");
  if (relativo === "index.html") return "/";
  if (relativo.endsWith("/index.html"))
    return `/${relativo.slice(0, -"index.html".length - 1)}`;
  return `/${relativo}`;
}

function costruisciCsp(hashScript) {
  const scriptSrc = ["'self'", ...hashScript.map((h) => `'sha256-${h}'`)];
  return [
    `default-src 'self'`,
    `script-src ${scriptSrc.join(" ")}`,
    `style-src 'self'`,
    `img-src 'self' data:`,
    `font-src 'self'`,
    `connect-src 'self'`,
    `object-src 'none'`,
    `base-uri 'none'`,
    `form-action 'self'`,
    `frame-ancestors 'none'`,
  ].join("; ");
}

function main() {
  const file = elencaFileHtml(DIST);
  const blocchi = [];

  for (const f of file) {
    const html = readFileSync(f, "utf-8");
    const script = estraiScriptInline(html);
    const hash = script.map(hashSha256Base64);
    const csp = costruisciCsp(hash);
    const percorso = percorsoPubblico(f);

    const pattern = percorso === "/" ? ["/"] : [percorso, `${percorso}/`];
    for (const p of pattern) {
      blocchi.push([
        p,
        [`Content-Security-Policy: ${csp}`, ...INTESTAZIONI_COMUNI],
      ]);
    }
  }

  // Fallback per qualunque risorsa non HTML (immagini, CSS, JS, sitemap...): niente
  // CSP basata su script inline (non è HTML), solo le intestazioni di sicurezza comuni.
  blocchi.unshift(["/*", INTESTAZIONI_COMUNI]);

  // I file in /_astro/ hanno un hash nel nome (cambiano nome a ogni modifica):
  // il browser può tenerli in cache per un anno senza ricontrollarli.
  blocchi.splice(1, 0, [
    "/_astro/*",
    ["Cache-Control: public, max-age=31536000, immutable"],
  ]);

  const testo = blocchi
    .map(([pattern, righe]) =>
      [pattern, ...righe.map((r) => `  ${r}`)].join("\n"),
    )
    .join("\n\n");

  writeFileSync(path.join(DIST, "_headers"), `${testo}\n`, "utf-8");
  console.log(
    `[generate-headers] Scritto dist/_headers per ${file.length} pagine.`,
  );
}

main();
