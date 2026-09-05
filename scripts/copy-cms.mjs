// Copia il bundle self-hosted di Sveltia CMS da node_modules in public/admin/,
// così /admin non carica alcuno script da un CDN esterno in runtime (coerente col
// vincolo "nessuna risorsa di terze parti caricata in runtime"): il file finisce
// nella build come qualunque altro asset statico del sito.
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const qui = path.dirname(fileURLToPath(import.meta.url));
const origine = path.resolve(
  qui,
  "../node_modules/@sveltia/cms/dist/sveltia-cms.js",
);
const destinazioneDir = path.resolve(qui, "../public/admin");
const destinazione = path.join(destinazioneDir, "sveltia-cms.js");

if (!existsSync(origine)) {
  console.warn(
    "[copy-cms] node_modules/@sveltia/cms non trovato: esegui `npm install` prima. Salto la copia.",
  );
  process.exit(0);
}

mkdirSync(destinazioneDir, { recursive: true });
copyFileSync(origine, destinazione);
console.log("[copy-cms] Sveltia CMS copiato in public/admin/sveltia-cms.js");
