// Verifica che dist/_headers sia stato generato correttamente: una CSP restrittiva
// (nessun 'unsafe-inline', nessun dominio di terze parti) su tutte le pagine, più
// le intestazioni di sicurezza di base. Richiede una build recente:
// `npm run build && npm test` (il postbuild genera _headers automaticamente).
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const DIST = path.resolve(__dirname, "../dist");
const FILE_HEADERS = path.join(DIST, "_headers");
const disponibile = existsSync(FILE_HEADERS);

describe.skipIf(!disponibile)("dist/_headers", () => {
  const contenuto = disponibile ? readFileSync(FILE_HEADERS, "utf-8") : "";

  it("non contiene 'unsafe-inline' né 'unsafe-eval'", () => {
    expect(contenuto).not.toContain("unsafe-inline");
    expect(contenuto).not.toContain("unsafe-eval");
  });

  it("non referenzia alcun dominio di terze parti nella CSP", () => {
    const righeCsp = contenuto
      .split("\n")
      .filter((riga) => riga.includes("Content-Security-Policy"));
    expect(righeCsp.length).toBeGreaterThan(0);
    for (const riga of righeCsp) {
      expect(riga).not.toMatch(/https?:\/\//);
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
});

if (!disponibile) {
  describe("dist/_headers", () => {
    it.skip("richiede `npm run build` prima di `npm test` per generare dist/_headers", () => {});
  });
}
