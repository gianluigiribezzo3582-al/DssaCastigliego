// Verifica che dist/_headers sia stato generato correttamente: una CSP restrittiva
// (nessun 'unsafe-inline', nessun dominio di terze parti) su tutte le pagine, più
// le intestazioni di sicurezza di base. Richiede una build recente:
// `npm run build && npm test` (il postbuild genera _headers automaticamente).
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const DIST = path.resolve(__dirname, "../dist");
const FILE_HEADERS = path.join(DIST, "_headers");
const disponibile = existsSync(FILE_HEADERS);

function elencaFileHtml(dir: string): string[] {
  const risultato: string[] = [];
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

describe.skipIf(!disponibile)("dist/_headers", () => {
  const contenuto = disponibile ? readFileSync(FILE_HEADERS, "utf-8") : "";

  // Blocchi "percorso + intestazioni" di _headers.
  const blocchi = contenuto
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean)
    .map((b) => ({ percorso: b.split("\n")[0], testo: b }));
  // Unica eccezione ammessa: l'interfaccia del CMS (Sveltia carica font e
  // traduzioni da CDN e usa stili in linea), dietro password. Non /admin/guida.
  const eCms = (percorso: string) =>
    percorso === "/admin" || percorso === "/admin/";
  const pubblici = blocchi.filter((b) => !eCms(b.percorso));

  it("le pagine pubbliche non contengono 'unsafe-inline' né 'unsafe-eval'", () => {
    for (const b of pubblici) {
      expect(b.testo, b.percorso).not.toContain("unsafe-inline");
      expect(b.testo, b.percorso).not.toContain("unsafe-eval");
    }
  });

  it("le pagine pubbliche non referenziano domini di terze parti nella CSP", () => {
    const righeCsp = pubblici.flatMap((b) =>
      b.testo
        .split("\n")
        .filter((riga) => riga.includes("Content-Security-Policy")),
    );
    expect(righeCsp.length).toBeGreaterThan(0);
    for (const riga of righeCsp) {
      expect(riga).not.toMatch(/https?:\/\//);
    }
  });

  it("il CMS ha una CSP dedicata, limitata ai servizi di cui Sveltia ha bisogno", () => {
    const cms = blocchi.filter((b) => eCms(b.percorso));
    expect(cms.map((b) => b.percorso).sort()).toEqual(["/admin", "/admin/"]);
    for (const b of cms) {
      const domini = [...b.testo.matchAll(/https:\/\/([^\s;]+)/g)].map(
        (m) => m[1],
      );
      expect(new Set(domini)).toEqual(
        new Set([
          "unpkg.com",
          "cdn.jsdelivr.net",
          "*.githubusercontent.com",
          "api.github.com",
          "www.githubstatus.com",
        ]),
      );
      expect(b.testo).not.toContain("unsafe-eval");
      expect(b.testo).toContain("frame-ancestors 'none'");
    }
  });

  it("imposta le intestazioni di sicurezza di base per tutte le risorse", () => {
    expect(contenuto).toContain("X-Content-Type-Options: nosniff");
    expect(contenuto).toContain(
      "Referrer-Policy: strict-origin-when-cross-origin",
    );
    expect(contenuto).toContain("X-Frame-Options: DENY");
  });

  it("include una regola specifica per la home e per /contatti", () => {
    expect(contenuto).toMatch(/^\/$/m);
    expect(contenuto).toMatch(/^\/contatti$/m);
  });

  it("nessuna pagina usa attributi style inline (bloccati dalla CSP style-src senza unsafe-inline)", () => {
    const fileHtml = elencaFileHtml(DIST);
    const conStyleInline = fileHtml.filter((f) =>
      /\sstyle="/.test(readFileSync(f, "utf-8")),
    );
    expect(conStyleInline.map((f) => path.relative(DIST, f))).toEqual([]);
  });
});

if (!disponibile) {
  describe("dist/_headers", () => {
    it.skip("richiede `npm run build` prima di `npm test` per generare dist/_headers", () => {});
  });
}
