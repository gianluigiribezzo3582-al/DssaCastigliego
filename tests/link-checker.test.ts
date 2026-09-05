// Link checker interno: verifica che ogni link relativo trovato nella build di
// produzione (dist/) punti a una pagina o risorsa effettivamente presente nella
// build stessa. Richiede una build recente: `npm run build && npm test`.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const DIST = path.resolve(__dirname, "../dist");

function elencaFileHtml(dir: string): string[] {
  const risultato: string[] = [];
  for (const voce of readdirSync(dir)) {
    const percorsoCompleto = path.join(dir, voce);
    if (statSync(percorsoCompleto).isDirectory()) {
      risultato.push(...elencaFileHtml(percorsoCompleto));
    } else if (voce.endsWith(".html")) {
      risultato.push(percorsoCompleto);
    }
  }
  return risultato;
}

function estraiHref(html: string): string[] {
  const hrefs = [...html.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
  return hrefs.filter(
    (href) =>
      href.startsWith("/") &&
      !href.startsWith("//") &&
      !href.startsWith("/api/"), // le API non sono file statici in dist
  );
}

function risolvePercorso(hrefGrezzo: string): boolean {
  const [percorso] = hrefGrezzo.split("#");
  const puliti = percorso.split("?")[0];

  if (puliti === "/") return existsSync(path.join(DIST, "index.html"));

  const candidati = [
    path.join(DIST, puliti, "index.html"),
    path.join(DIST, `${puliti}.html`),
    path.join(DIST, puliti),
  ];
  return candidati.some((c) => existsSync(c));
}

const distDisponibile = existsSync(DIST);

describe.skipIf(!distDisponibile)("link checker interno (dist/)", () => {
  const fileHtml = distDisponibile ? elencaFileHtml(DIST) : [];

  it("ha trovato almeno una pagina HTML da controllare", () => {
    expect(fileHtml.length).toBeGreaterThan(0);
  });

  for (const file of fileHtml) {
    const relativo = path.relative(DIST, file);
    it(`tutti i link interni di ${relativo} puntano a risorse esistenti`, () => {
      const html = readFileSync(file, "utf-8");
      const hrefs = estraiHref(html);
      const rotti = hrefs.filter((href) => !risolvePercorso(href));
      expect(
        rotti,
        `Link interni rotti in ${relativo}: ${rotti.join(", ")}`,
      ).toEqual([]);
    });
  }
});

if (!distDisponibile) {
  describe("link checker interno", () => {
    it.skip("richiede `npm run build` prima di `npm test` per generare dist/", () => {});
  });
}
