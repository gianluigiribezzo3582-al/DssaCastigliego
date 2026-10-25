# Asset visivi mancanti

Nessun contenuto di questo sito è generato da IA, per vincolo esplicito del progetto.
Questo file elenca ogni immagine/illustrazione che manca ancora, con percorso
previsto, dimensioni, formato e testo alternativo suggerito, così chi realizza gli
asset (fotografo, illustratore) sa esattamente cosa produrre.

## Logo e anteprima di condivisione

- `src/assets/logo/logo.png`: il logo (monogramma "EC" con girasole) ritagliato
  lungo il cerchio, con sfondo trasparente, 1420 × 1420 px. Ricavato dal file
  fornito, che aveva gli angoli neri al posto della trasparenza.
- `src/assets/social/anteprima.png`: il logo centrato sullo sfondo crema del sito,
  1200 × 630 px, usato come immagine Open Graph/Twitter (WhatsApp, social). In
  build viene convertito in JPEG leggero (circa 33 KB). Per cambiarlo basta
  sostituire il file. Dettagli in `src/assets/social/LEGGIMI.md`.

## Foto delle tre sezioni della home

La home ha tre sezioni, ognuna con una foto. Le foto vivono in
**`src/assets/foto/`** e vengono abbinate alla sezione **in base al nome del file**
(senza estensione), che deve coincidere con il nome del file di testo in
`src/content/sezioni/`:

| Sezione           | File da caricare                        |
| ----------------- | --------------------------------------- |
| Mi presento       | `src/assets/foto/mi-presento.jpg`       |
| Di cosa mi occupo | `src/assets/foto/di-cosa-mi-occupo.jpg` |
| La mia formazione | `src/assets/foto/la-mia-formazione.jpg` |

- Estensioni accettate: `.jpg`, `.jpeg`, `.png`, `.webp`, `.avif`.
- Se un file manca, la build non si rompe: al suo posto compare un riquadro neutro
  "Foto in arrivo" (logica in `src/pages/index.astro`).
- Le foto passano dalla pipeline immagini di Astro (WebP, 800 px di larghezza) e sono
  ritagliate via CSS in **4:5 verticale** (`object-cover`): consigliato almeno
  1600 px sul lato lungo, soggetto centrato.
- Testo alternativo e didascalia si impostano dal CMS (campi `altFoto` e
  `didascaliaFoto` di ogni sezione). Se la foto di "Di cosa mi occupo" è il
  _Viandante sul mare di nebbia_ di Caspar David Friedrich (1818, pubblico dominio),
  conviene compilare la didascalia con titolo, autore e anno.

La vecchia foto segnaposto (`placeholder.jpeg`) e il componente `RitrattoElisa.astro`
sono stati rimossi.

**Vincoli sulla foto**: nessun ritocco generativo, nessuna estensione dei bordi con
IA, nessun filtro generativo. Ritaglio, ridimensionamento e conversione in formati
moderni (WebP/AVIF) sono invece già gestiti automaticamente dalla pipeline immagini
di Astro.

## Icona del sito (favicon)

Generata dal logo (`src/assets/logo/logo.png`):

- `public/favicon.ico`: 16, 32 e 48 px, sfondo trasparente (schede del browser);
- `public/apple-touch-icon.png`: 180 px, logo su sfondo crema (iPhone/iPad: iOS non
  gestisce la trasparenza e riempirebbe gli angoli di nero);
- `public/icon-192.png`, `public/icon-512.png` e `public/site.webmanifest`: Android
  ("aggiungi a schermata Home"); `icon-192.png` è anche il logo nel CMS.

Per cambiarla: sostituire il logo e rigenerare questi file alle stesse dimensioni.

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
