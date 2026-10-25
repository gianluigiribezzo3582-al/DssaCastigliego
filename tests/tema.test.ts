import { describe, expect, it } from "vitest";
import {
  COLORI_ORIGINALI,
  contrasto,
  cssTema,
  risolviTema,
  testoSuPrincipale,
} from "../src/lib/tema";
import temaAttuale from "../src/content/tema.json";

describe("tema dei colori dal CMS", () => {
  it("la palette originale supera tutti i controlli di contrasto", () => {
    expect(risolviTema(COLORI_ORIGINALI).avvisi).toEqual([]);
  });

  it("il tema salvato nel CMS è valido così com'è", () => {
    expect(risolviTema(temaAttuale).avvisi).toEqual([]);
  });

  it("accetta un colore principale diverso ma leggibile", () => {
    const { colori, avvisi } = risolviTema({ principale: "#2f5d62" });
    expect(avvisi).toEqual([]);
    expect(colori.principale).toBe("#2f5d62");
  });

  it("ripristina un testo troppo chiaro", () => {
    const { colori, avvisi } = risolviTema({ testo: "#dddddd" });
    expect(colori.testo).toBe(COLORI_ORIGINALI.testo);
    expect(avvisi.join(" ")).toContain("testo");
  });

  it("ripristina gli sfondi se diventano troppo scuri", () => {
    const { colori } = risolviTema({ sfondo: "#222222" });
    expect(colori.sfondo).toBe(COLORI_ORIGINALI.sfondo);
    expect(contrasto(colori.testo, colori.sfondo)).toBeGreaterThanOrEqual(4.5);
  });

  it("ignora valori non validi e accetta il formato breve", () => {
    expect(risolviTema({ bordi: "rosso" }).colori.bordi).toBe(
      COLORI_ORIGINALI.bordi,
    );
    expect(risolviTema({ bordi: "#CCC" }).colori.bordi).toBe("#cccccc");
  });

  it("sceglie il testo dei pulsanti più leggibile e genera il CSS", () => {
    expect(testoSuPrincipale("#ac4c2b")).toBe("#ffffff");
    expect(testoSuPrincipale("#f2c14e")).toBe("#1a1412");
    const css = cssTema(risolviTema(COLORI_ORIGINALI));
    expect(css).toContain("html:root");
    expect(css).toContain("--color-primary: #ac4c2b");
  });
});
