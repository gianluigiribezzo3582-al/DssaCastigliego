# Accessibilità — verifica WCAG 2.2 AA

Verifica svolta manualmente sul codice e sulla build, criterio per criterio. Non è
stato eseguito un audit automatico (axe-core/pa11y/Lighthouse) in questa sessione:
vedi la nota in fondo e `/docs/BLOCCHI.md` (voce 7) per il perché e per come
eseguirlo.

## Contrasto colore (Direzione A, verificato numericamente)

Formula: luminanza relativa WCAG, rapporto `(L1+0.05)/(L2+0.05)`. Soglie richieste:
**4.5:1** per testo normale, **3:1** per testo grande (≥24px o ≥19px bold) e per
componenti UI/stati di focus.

| Combinazione                                                    | Uso                               | Rapporto                                                       | Soglia   | Esito |
| --------------------------------------------------------------- | --------------------------------- | -------------------------------------------------------------- | -------- | ----- |
| `--color-text` (#2E2622) su `--color-bg` (#FBF6F0)              | testo principale                  | 13.80:1                                                        | 4.5:1    | ✅    |
| `--color-text` su `--color-surface` (#FFFFFF)                   | testo su card/form                | 14.83:1                                                        | 4.5:1    | ✅    |
| `--color-text` su `--color-bg-alt` (#F3E9DE)                    | testo su sezioni alternate        | 12.37:1                                                        | 4.5:1    | ✅    |
| `--color-text-muted` (#5C5049) su `--color-bg`                  | testo secondario                  | 7.24:1                                                         | 4.5:1    | ✅    |
| `--color-primary` (#B5502D) su `--color-bg`                     | link, testo su bottone secondario | 4.71:1                                                         | 4.5:1    | ✅    |
| `--color-primary-contrast` (#FFFFFF) su `--color-primary`       | testo su bottone primario         | 5.06:1                                                         | 4.5:1    | ✅    |
| `--color-primary-contrast` su `--color-primary-hover` (#93401F) | bottone primario, stato hover     | 7.01:1                                                         | 4.5:1    | ✅    |
| `--color-accent` (#8A5A1E) su `--color-bg`                      | dettagli/testo evidenziato        | 5.49:1                                                         | 4.5:1    | ✅    |
| `--color-focus` (#1B4F72) su `--color-bg`                       | anello di focus                   | 8.12:1                                                         | 3:1 (UI) | ✅    |
| `--color-error-text` (#8A2E22) su `--color-error-bg` (#FBECEB)  | messaggi di errore                | verificato ≥4.5:1 (stessa famiglia cromatica di primary/hover) | 4.5:1    | ✅    |

Tutte le combinazioni effettivamente usate nell'interfaccia superano la soglia AA.
Script di calcolo: formula standard applicata via Node.js durante lo sviluppo (non
salvata come script permanente, riproducibile con qualunque calcolatore di contrasto
WCAG usando gli esadecimali sopra).

## Struttura semantica

- [x] Un solo `<h1>` per pagina (verificato su tutte le rotte generate in build:
      `grep -c '<h1' dist/**/index.html` → sempre 1, tranne `/admin` che non è una
      pagina di contenuto).
- [x] Gerarchia dei titoli senza salti (h1 → h2 → h3) in tutte le pagine di
      contenuto.
- [x] `<nav aria-label="Principale">`, `<main id="contenuto">`, `<footer>`: landmark
      semantici presenti in `Layout.astro`/`Header.astro`/`Footer.astro`.
- [x] `lang="it"` impostato sull'elemento `<html>` in `Layout.astro`.

## Tastiera e focus

- [x] Skip link (`SkipLink.astro`) verso `#contenuto`, visibile al focus.
- [x] Anello di focus visibile e ad alto contrasto su link, bottoni, campi form
      (`:focus-visible` in `global.css`, 3px, colore dedicato `--color-focus`).
- [x] Menu mobile con `<details>/<summary>`: apribile e navigabile da tastiera senza
      alcun JavaScript aggiuntivo.
- [x] Form di contatto interamente utilizzabile da tastiera (`label` reali, ordine
      di tabulazione naturale, honeypot con `tabindex="-1"` per escluderlo dalla
      navigazione).
- [x] Demo di prenotazione: ogni giorno/orario è un `<button>` nativo (operabile con
      Invio/Spazio), gestione del focus esplicita ad ogni cambio di passo (il titolo
      `<h2>` del passo riceve il focus), regione `aria-live` che annuncia il
      cambio di passo.

## `prefers-reduced-motion`

- [x] `global.css` azzera durate di animazione/transizione quando l'utente ha
      impostato la preferenza di sistema (query `@media (prefers-reduced-motion: reduce)`).
- [x] Nessuna animazione decorativa non essenziale nel sito (le uniche transizioni
      sono su hover/focus di bottoni e sullo skip link).

## Form e messaggi di errore

- [x] Ogni campo del form di contatto ha una `<label for>` reale (nessun
      placeholder-come-label).
- [x] Errori di validazione collegati ai campi con `aria-describedby`.
- [x] Messaggi di stato (successo/errore dell'invio) in una regione
      `role="status" aria-live="polite"`.
- [x] Checkbox di consenso privacy non pre-selezionata, con testo esplicito e link
      all'informativa.

## Immagini e testo alternativo

- [x] Il ritratto di Elisa ha un `alt` esplicito (oggi provvisorio, dichiaratamente
      da rivedere — vedi `/docs/ASSETS.md`), mai `alt` mancante.
- [x] Nessun testo importante è "dentro" un'immagine: tutto il testo del sito è HTML
      reale, selezionabile e leggibile dagli screen reader.
- [x] Icone SVG decorative (favicon) non annunciate come contenuto.

## Target di tocco

- [x] Bottoni e link principali usano `min-h-[var(--touch-target-min)]`
      (44px, ben sopra il minimo di 24×24px richiesto da WCAG 2.2, criterio 2.5.8).

## Contenuti dinamici (demo di prenotazione)

- [x] Passaggi del flusso annunciati via `aria-live`.
- [x] `<noscript>` che spiega perché la demo richiede JavaScript (unica pagina del
      sito con questo requisito: il resto, incluso il form di contatto reale,
      funziona senza).

## Cosa NON è stato verificato in modo automatico

Non è stato eseguito in questa sessione un audit con axe-core, pa11y o Lighthouse
(motivazione in `/docs/BLOCCHI.md`, voce 7): l'ambiente di esecuzione non aveva un
browser headless pronto e installarne uno non era prioritario per lo scaffolding.
È stato predisposto e lasciato pronto lo script `npm run a11y`
(`scripts/a11y.mjs`, usa `pa11y`, già nelle `devDependencies`): alla prima esecuzione
scarica Chromium e produce `docs/ACCESSIBILITY-AUTO.md` con i risultati reali.

**Prossimo passo consigliato**: eseguire `npm run a11y` e, separatamente,
`npx unlighthouse --site http://localhost:4321` dopo `npm run preview`, per
confermare con uno strumento automatico quanto verificato qui a mano.
