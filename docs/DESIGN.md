# Design — sistema e tre direzioni

Non potendo chiedere una preferenza, ho sviluppato per intero la **Direzione A**
(implementata in `src/styles/tokens.css` e in tutto il sito) e documentato qui le
Direzioni B e C come alternative di sola palette/tipografia, attivabili modificando
**un solo file**: `src/styles/tokens.css` (commentare il blocco "Direzione A", scommentare
il blocco desiderato — e, per B/C, installare il pacchetto di font indicato più sotto).

Ho scartato esplicitamente il template "standard" del settore psicologico
(verde salvia, serif elegante sottile, foto di mani intrecciate): nessuna delle tre
direzioni usa il verde salvia, nessuna usa una serif sottile "da matrimonio", e le
inquadrature previste per la fotografia (vedi `ASSETS.md`) sono ritratti diretti, non
metafore visive da stock photography.

Tono generale richiesto e perseguito in tutte e tre le direzioni: caldo, accogliente,
professionale — mai clinico-freddo, mai patinato.

## Stile attuale: "Quaderno di osservazione" (evoluzione della Direzione A)

Stessa palette terracotta e stessi font della Direzione A, con un'impaginazione
editoriale ispirata al mondo di Elisa (Infant Observation, tradizione Tavistock,
i "cento linguaggi" di Malaguzzi): un quaderno di appunti più che un sito "da studio".

- **Angoli quasi vivi** (`--radius-*` a 2-3 px), niente pulsanti a pillola, niente
  ombre morbide (`--shadow-card: none`): la profondità viene da filetti sottili.
- **Sezioni numerate** `01 / 02 / 03` in Fraunces corsivo seguite da un filetto
  (`.numero-sezione`), titoli grandi in Fraunces con peso medio.
- **Etichette** in maiuscoletto spaziato color ocra (`.etichetta`) sopra i titoli,
  nel menu e nel footer.
- **Foto con cornice sfalsata** terracotta (`.cornice`), come un passe-partout; su
  desktop la foto resta ferma (sticky) mentre scorre il testo lungo accanto.
- **Hero** allineato a sinistra con nome grande e un piccolo indice "In questa
  pagina" che porta alle tre sezioni.
- **Pulsanti** rettangolari, testo maiuscolo spaziato con freccia che si sposta al
  passaggio del mouse (ferma con `prefers-reduced-motion`).
- **Mobile**: ogni sezione si legge titolo → immagine → testo; menu a pannello a
  tutta larghezza; tutto allineato a sinistra sullo stesso margine.

Le classi sono in `src/styles/global.css`, i token in `src/styles/tokens.css`.

---

## Direzione A — "Terracotta calda" (implementata)

**Razionale:** il terracotta è un colore caldo, umano, poco usato nel settore
psicologico (dominato da verdi/blu freddi o pastelli), che comunica calore senza
scadere nel decorativo. L'accoppiata con un avorio caldo di sfondo (mai bianco puro)
evita la sensazione "clinica". Fraunces è una serif contemporanea con un tratto morbido
e un po' "wonky": ha calore e carattere senza essere l'elegante serif sottile da
studio legale/spa che il prompt chiede esplicitamente di evitare. Work Sans in testo
resta leggibilissima e amichevole.

| Token                                  | Valore                | Uso                                                                                              |
| -------------------------------------- | --------------------- | ------------------------------------------------------------------------------------------------ |
| `--color-bg`                           | `#FBF6F0`             | sfondo pagina                                                                                    |
| `--color-bg-alt`                       | `#F3E9DE`             | sezioni alternate                                                                                |
| `--color-surface`                      | `#FFFFFF`             | card, form                                                                                       |
| `--color-text`                         | `#2E2622`             | testo principale (bruno caldo, non nero puro)                                                    |
| `--color-text-muted`                   | `#5C5049`             | testo secondario                                                                                 |
| `--color-primary`                      | `#B5502D`             | bottoni, link, CTA                                                                               |
| `--color-primary-hover`                | `#93401F`             | stato hover/attivo                                                                               |
| `--color-accent` / `--color-accent-bg` | `#8A5A1E` / `#C98A3B` | dettagli, badge, evidenze                                                                        |
| `--color-focus`                        | `#1B4F72`             | anello di focus (blu scuro, ad alto contrasto, volutamente fuori palette per massima visibilità) |

**Tipografia:** titoli in **Fraunces** (variabile, asse `wght`), testo in **Work Sans**.
Entrambe con licenza **SIL Open Font License 1.1**, self-hosted via i pacchetti npm
`@fontsource-variable/fraunces` e `@fontsource/work-sans` (nessuna richiesta a Google
Fonts o altro CDN in runtime, coerente col vincolo di privacy).

**Contrasto colore (verificato numericamente, formula WCAG relative luminance):**
vedi la tabella completa in `/docs/ACCESSIBILITY.md` — tutte le combinazioni usate
superano 4.5:1.

---

## Direzione B — "Blu crepuscolo" (alternativa, non implementata)

**Razionale:** per chi preferisse un tono più quieto/riflessivo mantenendo calore nei
dettagli. Un blu-petrolio smorzato (non un blu corporate freddo) come colore
principale, con terracotta relegato a dettagli/accenti — palette invertita rispetto
alla A. Evita comunque il verde salvia.

| Token             | Valore    |
| ----------------- | --------- |
| `--color-bg`      | `#F5F7F7` |
| `--color-text`    | `#1F2A2E` |
| `--color-primary` | `#3B6E71` |
| `--color-accent`  | `#8A3F24` |

**Tipografia:** titoli in **Literata** (serif editoriale, calda, meno "decorativa" di
una classica serif da invito), testo in **Karla** (sans geometrica ma morbida negli
angoli). Entrambe OFL, disponibili come `@fontsource/literata` e `@fontsource/karla`
(non installate finché questa direzione non viene scelta).

Contrasto indicativo verificato (testo/sfondo 13.7:1, bottone bianco/primario 5.75:1):
tutte le combinazioni superano AA.

---

## Direzione C — "Ocra e prugna" (alternativa, non implementata)

**Razionale:** la più contemporanea delle tre, pensata se si volesse un'identità più
"editoriale social-first" (coerente col fatto che il traffico arriverà soprattutto da
Instagram). Un'unica famiglia sans per titoli e testo (pesi diversi) invece della
coppia serif/sans, per un effetto più diretto e meno formale; colori ocra/prugna,
ancora una volta lontani dal verde salvia da manuale.

| Token             | Valore    |
| ----------------- | --------- |
| `--color-bg`      | `#FAF3E8` |
| `--color-text`    | `#2B2320` |
| `--color-primary` | `#8C5383` |
| `--color-accent`  | `#96631A` |

**Tipografia:** **Sora** (sans geometrica arrotondata, un'unica famiglia per titoli e
testo, differenziata per peso). OFL, `@fontsource/sora` (non installato).

Contrasto indicativo verificato (testo/sfondo 14:1, bottone bianco/primario 5.7:1):
tutte le combinazioni superano AA.

---

## Come cambiare direzione

1. Aprire `src/styles/tokens.css`.
2. Commentare il blocco `:root` "Direzione A" attivo (colori + font-heading/font-body).
3. Scommentare il blocco della direzione scelta (B o C).
4. Se si sceglie B o C, installare i font indicati sopra (`npm install @fontsource/...`)
   e aggiungerne l'import in cima a `src/styles/global.css` al posto di quelli di
   Fraunces/Work Sans.
5. `npm run build` per verificare che tutto compili — nessun altro file va toccato,
   perché ogni componente legge solo i token, mai un colore o un font hardcoded.

## Token non cromatici (comuni alle tre direzioni)

Scala spaziature su base 4px, scala tipografica in `rem`, raggi angoli, ombre-card,
durata delle transizioni azzerata automaticamente con `prefers-reduced-motion: reduce`.
Definiti in `src/styles/tokens.css`, indipendenti dalla direzione scelta.

## Slot per illustrazioni

Il layout prevede punti di innesto per illustrazioni realizzate da un illustratore
esterno (nessuna illustrazione generata da IA). Misure e posizioni esatte in
`/docs/ASSETS.md`.
