// Colori del sito modificabili dal CMS (/admin → "Colori del sito", file
// src/content/tema.json). Da qui nasce il foglio di stile /tema.css, generato in
// build (src/pages/tema.css.ts): un file vero e non uno stile in linea, così la
// Content-Security-Policy resta restrittiva.
//
// Salvaguardia di accessibilità (WCAG 2.2 AA): se un colore scelto non è
// abbastanza leggibile sugli sfondi, per quella voce si usa il colore originale.

export interface ColoriTema {
  sfondo: string;
  sfondoAlternato: string;
  testo: string;
  testoSecondario: string;
  principale: string;
  accento: string;
  bordi: string;
}

/** Palette originale ("Quaderno di osservazione", Direzione A). */
export const COLORI_ORIGINALI: ColoriTema = {
  sfondo: "#fbf6f0",
  sfondoAlternato: "#f3e9de",
  testo: "#2e2622",
  testoSecondario: "#5c5049",
  principale: "#ac4c2b",
  accento: "#8a5a1e",
  bordi: "#e4d5c6",
};

const CONTRASTO_MINIMO = 4.5;

function normalizzaHex(valore: unknown): string | null {
  if (typeof valore !== "string") return null;
  const v = valore.trim().toLowerCase();
  if (/^#[0-9a-f]{6}$/.test(v)) return v;
  if (/^#[0-9a-f]{3}$/.test(v))
    return `#${v[1]}${v[1]}${v[2]}${v[2]}${v[3]}${v[3]}`;
  return null;
}

function rgb(hex: string): [number, number, number] {
  return [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)) as [
    number,
    number,
    number,
  ];
}

function luminanza(hex: string): number {
  const [r, g, b] = rgb(hex).map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Rapporto di contrasto WCAG tra due colori esadecimali. */
export function contrasto(a: string, b: string): number {
  const [chiaro, scuro] = [luminanza(a), luminanza(b)].sort((x, y) => y - x);
  return (chiaro + 0.05) / (scuro + 0.05);
}

/** Scurisce un colore della frazione indicata (0-1), per lo stato "hover". */
export function scurisci(hex: string, frazione: number): string {
  return `#${rgb(hex)
    .map((c) =>
      Math.round(c * (1 - frazione))
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`;
}

/** Testo bianco o quasi nero sopra il colore principale, quello più leggibile. */
export function testoSuPrincipale(principale: string): string {
  return contrasto("#ffffff", principale) >= contrasto("#1a1412", principale)
    ? "#ffffff"
    : "#1a1412";
}

export interface EsitoTema {
  colori: ColoriTema;
  /** Voci riportate al colore originale, con il motivo. */
  avvisi: string[];
}

/**
 * Valida i colori scelti nel CMS: formato esadecimale e contrasto minimo su
 * entrambi gli sfondi. Ogni voce non valida torna al colore originale.
 */
export function risolviTema(
  scelti: Partial<Record<keyof ColoriTema, unknown>>,
): EsitoTema {
  const avvisi: string[] = [];
  const colori = { ...COLORI_ORIGINALI };

  for (const chiave of Object.keys(COLORI_ORIGINALI) as (keyof ColoriTema)[]) {
    const v = normalizzaHex(scelti[chiave]);
    if (v) colori[chiave] = v;
    else if (scelti[chiave] !== undefined)
      avvisi.push(`${chiave}: valore "${String(scelti[chiave])}" non valido`);
  }

  // Gli sfondi devono restare chiari abbastanza per il testo originale; se uno
  // sfondo è stato cambiato e non regge, si torna alla coppia di sfondi originale.
  const leggibileSuSfondi = (colore: string) =>
    contrasto(colore, colori.sfondo) >= CONTRASTO_MINIMO &&
    contrasto(colore, colori.sfondoAlternato) >= CONTRASTO_MINIMO;

  for (const chiave of [
    "testo",
    "testoSecondario",
    "principale",
    "accento",
  ] as const) {
    if (!leggibileSuSfondi(colori[chiave])) {
      avvisi.push(
        `${chiave}: contrasto insufficiente sugli sfondi, ripristinato`,
      );
      colori[chiave] = COLORI_ORIGINALI[chiave];
    }
  }
  // Se anche il colore originale non regge, il problema sono gli sfondi.
  for (const chiave of [
    "testo",
    "testoSecondario",
    "principale",
    "accento",
  ] as const) {
    if (!leggibileSuSfondi(colori[chiave])) {
      avvisi.push("sfondi: troppo scuri per il testo, ripristinati");
      colori.sfondo = COLORI_ORIGINALI.sfondo;
      colori.sfondoAlternato = COLORI_ORIGINALI.sfondoAlternato;
      break;
    }
  }

  return { colori, avvisi };
}

/** Foglio di stile con le variabili CSS del tema. */
export function cssTema({ colori }: EsitoTema): string {
  const principaleHover = scurisci(colori.principale, 0.18);
  // html:root ha specificità maggiore di :root, quindi vince sui valori di
  // tokens.css qualunque sia l'ordine di caricamento dei fogli di stile.
  return `/* Generato da src/content/tema.json (CMS → Colori del sito) */
html:root {
  --color-bg: ${colori.sfondo};
  --color-bg-alt: ${colori.sfondoAlternato};
  --color-text: ${colori.testo};
  --color-text-muted: ${colori.testoSecondario};
  --color-primary: ${colori.principale};
  --color-primary-hover: ${principaleHover};
  --color-primary-contrast: ${testoSuPrincipale(colori.principale)};
  --color-accent: ${colori.accento};
  --color-border: ${colori.bordi};
}
`;
}
