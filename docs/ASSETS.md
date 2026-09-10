# Asset visivi mancanti

Nessun contenuto di questo sito è generato da IA, per vincolo esplicito del progetto.
Questo file elenca ogni immagine/illustrazione che manca ancora, con percorso
previsto, dimensioni, formato e testo alternativo suggerito, così chi realizza gli
asset (fotografo, illustratore) sa esattamente cosa produrre.

## Fotografia di Elisa

Un solo componente, **`src/components/RitrattoElisa.astro`**, controlla il ritratto
mostrato in tutto il sito. Ora è modificabile in due modi:

- **Dal CMS** (il modo pensato per Elisa): `/admin` → "Contatti e dati dello
  studio" → campo "Foto del ritratto". Caricando lì una foto, questa sostituisce
  ovunque quella segnaposto, senza intervento di uno sviluppatore. In questo caso
  l'immagine viene mostrata così com'è caricata (non passa dalla pipeline di
  ottimizzazione di Astro — vedi il compromesso spiegato nel commento del
  componente e in `/docs/DECISIONI.md`), e la **stessa foto** viene ritagliata via
  CSS nelle tre inquadrature sotto: per un risultato pulito conviene caricare una
  foto già abbastanza quadrata/verticale, con il soggetto centrato e non troppo
  vicino ai bordi.
- **Da codice** (finché il campo CMS resta vuoto): il file sorgente
  `src/assets/placeholder.jpeg` (oggi una foto fittizia), ottimizzato
  automaticamente da Astro in build (WebP, dimensioni per variante). Sostituendo
  quel file o il campo nel CMS non serve toccare nessun'altra pagina.

Il componente serve tre inquadrature, con queste proporzioni esatte (la pipeline
immagini di Astro si occupa di ritaglio/ridimensionamento/formati moderni, ma la foto
sorgente dovrebbe già rispettare all'incirca queste proporzioni per un risultato
ottimale senza tagli imprevisti):

| Variante    | Proporzioni     | Dimensioni servite | Dove viene usata   |
| ----------- | --------------- | ------------------ | ------------------ |
| `verticale` | 3:4 (verticale) | 720×960            | Home, sezione hero |
| `quadrata`  | 1:1 (quadrata)  | 640×640            | Pagina "Chi sono"  |
| `piccola`   | 1:1 (quadrata)  | 240×240            | Pagina "Contatti"  |

**Testo alternativo (`alt`)**: oggi impostato a un valore esplicitamente provvisorio
("Ritratto provvisorio — foto segnaposto, in attesa della fotografia definitiva...").
Il testo alternativo definitivo va scritto insieme a Elisa quando arriva la foto vera
(dovrebbe restare semplice e descrittivo, es. "Elisa Castigliego, psicologa, ritratto
in studio" — da confermare con lei, non da inventare qui).

**Vincoli sulla foto**: nessun ritocco generativo, nessuna estensione dei bordi con
IA, nessun filtro generativo. Ritaglio, ridimensionamento e conversione in formati
moderni (WebP/AVIF) sono invece già gestiti automaticamente dalla pipeline immagini
di Astro.

## Icona del sito (favicon)

`public/favicon.svg` contiene oggi un monogramma "EC" molto semplice (cerchio +
iniziali), scritto a mano in SVG — non generato, ma solo un segnaposto minimo.
Va sostituito con un logo/monogramma reale quando disponibile (stesso percorso,
formato SVG preferibile per la nitidezza a ogni dimensione).

## Immagine Open Graph / social share

Non è stata creata alcuna immagine Open Graph (quella che compare quando il link al
sito viene condiviso su social o messaggistica): il tag `og:image` è stato
volutamente omesso da `src/layouts/Layout.astro` finché non esiste un'immagine reale,
per non pubblicare un placeholder generato artificialmente al posto suo.

- **Percorso previsto**: `public/og-immagine.jpg`
- **Dimensioni**: 1200×630 px (rapporto 1.91:1, lo standard Open Graph)
- **Formato**: JPG o PNG, peso indicativo sotto i 300 KB
- **Contenuto suggerito**: nome + titolo professionale su sfondo semplice nei colori
  del sito (Direzione A: terracotta/avorio, vedi `/docs/DESIGN.md`), eventualmente
  con un ritaglio della fotografia definitiva quando disponibile

Una volta creata, aggiungere in `Layout.astro` le righe:

```html
<meta property="og:image" content={new URL("/og-immagine.jpg", Astro.site)} />
<meta name="twitter:image" content={new URL("/og-immagine.jpg", Astro.site)} />
```

## Mappa dello studio

Nella pagina contatti non è incorporata alcuna mappa (niente iframe Google Maps, per
privacy): oggi c'è un riquadro segnaposto tratteggiato con un link a OpenStreetMap.
Se in futuro si preferisce un'immagine statica della mappa al posto del link:

- **Percorso previsto**: `src/assets/mappa-studio.jpg` (o `.png`)
- **Proporzioni**: 4:3
- **Alt suggerito**: "Mappa con la posizione dello studio, {{INDIRIZZO_STUDIO_VIA}}, Bologna"

## Slot per illustrazioni (illustratore esterno)

Il layout attuale non include ancora spazi per illustrazioni (il sito oggi si affida
a fotografia + tipografia + colore), ma è stato progettato per poterne accogliere in
seguito senza ristrutturare le pagine. Punti suggeriti, con misure indicative:

| Posizione                                               | Proporzioni suggerite                        | Note                                                                             |
| ------------------------------------------------------- | -------------------------------------------- | -------------------------------------------------------------------------------- |
| Home, sotto la sezione "Come si inizia"                 | 16:9, larghezza piena container (max 1152px) | Illustrazione leggera, non decorativa invasiva: deve restare secondaria al testo |
| Pagina "Come lavoro", accanto alla sezione "Il setting" | 1:1 o 4:3                                    | Facoltativa                                                                      |
| Pagina 404 (da creare)                                  | Libera                                       | Un'illustrazione qui è a basso rischio, pagina di servizio                       |

Ogni illustrazione andrà inserita seguendo lo stesso principio usato per la
fotografia: un componente dedicato che importa l'asset da un unico punto, `alt`
scritto a mano (mai generato), nessun filtro o elaborazione generativa.

## Icone di interfaccia

Le icone dell'interfaccia (email, telefono, WhatsApp, menu, indirizzo, frecce dei
passaggi in home, torna-su) provengono tutte da **`@lucide/astro`**, libreria open
source già installata nel progetto — nessuna icona generata o disegnata ad hoc.
Se ne servissero altre in futuro, stessa fonte: `import NomeIcona from "@lucide/astro/icons/nome-icona"`.

## Fotografie decorative di sfondo

Due sezioni del sito (home, "Per chi lavoro"; footer di ogni pagina) hanno uno
sfondo fotografico molto discreto (opacità 7-10%), per dare calore senza
distrarre dal testo. Sono **fotografie reali con licenza libera**, non generate:

| File                                      | Soggetto                              | Fotografo     | Fonte                                                                                        | Licenza                                   |
| ----------------------------------------- | ------------------------------------- | ------------- | -------------------------------------------------------------------------------------------- | ----------------------------------------- |
| `src/assets/sfondi/tegole-terracotta.jpg` | Tegole in terracotta, primo piano     | Peter Muscutt | [Unsplash](https://unsplash.com/photos/brown-roof-tiles-in-close-up-photography-Jii1bSg3Q_I) | Unsplash License (uso commerciale libero) |
| `src/assets/sfondi/lino-texture.jpg`      | Trama di tessuto di lino, primo piano | Annie Spratt  | [Unsplash](https://unsplash.com/photos/beige-linen-fabric-texture-background-xTaOPMa6wAE)    | Unsplash License (uso commerciale libero) |

Scelte deliberatamente **astratte/materiche** (una trama, un tessuto) invece di
foto "a tema psicologia" (persone, mani, divani da studio): è la stessa logica
del vincolo originale "evita il verde salvia e le mani intrecciate" applicata
anche a queste immagini di sfondo — vedi `/docs/DECISIONI.md`.

Sono sostituibili in qualunque momento senza toccare il layout: basta cambiare
il file all'interno di `src/assets/sfondi/` (stesso nome) o l'import nel
componente che lo usa (`src/pages/index.astro`, `src/components/Footer.astro`).
Se in futuro arriva un illustratore, queste sono le prime due immagini che
probabilmente conviene sostituire con un suo lavoro originale.
