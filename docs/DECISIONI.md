# Decisioni prese in autonomia

Log delle scelte prese senza supervisione durante la sessione di scaffolding, in ordine
cronologico. Per ognuna: cosa è stato deciso, le alternative scartate e il costo stimato
per cambiare idea in seguito.

---

## 1. Struttura del repository: file spostati dalla sottocartella generata da `create-astro`

**Deciso:** `npm create astro` non accetta di scrivere in una cartella non vuota (c'era già
`placeholder.jpeg`), quindi ha creato una sottocartella `bustling-binary/`. Ho spostato tutto
il contenuto nella radice del progetto e rimosso la sottocartella.

**Alternative scartate:** spostare `placeholder.jpeg` altrove prima dello scaffolding e
riportarlo dopo — scartata perché più fragile (rischio di perdere il file) a fronte dello
stesso risultato.

**Costo per cambiare idea:** nullo, è un dettaglio di esecuzione senza conseguenze sul codice.

---

## 2. Package manager e template Astro

**Deciso:** Astro 7, template `minimal`, TypeScript `strict`, output statico (nessun
adapter server-side, coerente col vincolo "costi ricorrenti zero" e con l'hosting su
Cloudflare Pages in modalità statica). Ho rimosso `CLAUDE.md`/`AGENTS.md` generati
automaticamente dallo scaffold perché non pertinenti a questo progetto.

**Alternative scartate:** template `basic` (porta con sé pagine/esempi da ripulire, più
lavoro); Next.js/SvelteKit (stack più pesante, meno adatto a un sito principalmente
statico con CMS git-based).

**Costo per cambiare idea:** medio-basso nella fase attuale (poco codice scritto),
crescente man mano che si aggiungono pagine.

---

## 3. Tailwind CSS v4 via `@tailwindcss/vite` (non `@astrojs/tailwind`)

**Deciso:** l'integrazione ufficiale `@astrojs/tailwind` è pensata per Tailwind v3 ed è in
via di superamento; con Astro 7 il percorso raccomandato è il plugin Vite ufficiale di
Tailwind v4, aggiunto con `astro add tailwind`.

**Alternative scartate:** Tailwind v3 con `@astrojs/tailwind` — scartata perché è la via
in fase di deprecazione, avrebbe richiesto una migrazione a breve termine.

**Costo per cambiare idea:** medio, richiederebbe riscrivere le classi con sintassi v3
se si tornasse indietro (improbabile sia necessario).

---

## 4. Icone: `@lucide/astro` invece di `lucide-astro`

**Deciso:** durante l'installazione npm ha segnalato `lucide-astro` come deprecato in
favore di `@lucide/astro` (stesso progetto, pacchetto rinominato). Installato quest'ultimo,
compatibile col vincolo "icone da libreria open source esistente, non generate".

**Costo per cambiare idea:** basso, è un solo pacchetto con API equivalente.

---

## 5. CMS: Sveltia CMS con backend "locale/proxy" in sviluppo, Worker OAuth predisposto ma non collegato

**Deciso:** come richiesto, Sveltia CMS su `/admin`, con `local_backend: true` per poter
lavorare su `npm run dev` senza credenziali GitHub. Il Worker OAuth per l'autenticazione
GitHub reale è scritto per intero in `worker-oauth/` ma non collegato a nessuna GitHub App
(la registrazione richiede un account e credenziali che non è consentito creare in
autonomia — vedi `BLOCCHI.md`).

**Alternative scartate:** Decap CMS — l'indicazione del prompt era di ripiegare su Decap
solo "se l'integrazione con Sveltia risultasse problematica". Sveltia si è configurato senza
problemi (stessa `config.yml` di Decap, backend locale supportato nativamente), quindi non
è stato necessario il ripiego.

**Costo per cambiare idea:** basso — Sveltia e Decap condividono `config.yml`; cambiare
significa sostituire lo script caricato in `public/admin/index.html`.

---

## 6. Form di contatto: Cloudflare Pages Function + driver `mock`/`brevo`, nessuna persistenza

**Deciso:** endpoint `/api/contatto` implementato come Pages Function TypeScript. Rate
limiting in memoria di richiesta (Worker isolate) con IP hashato con `RATE_LIMIT_SALT` e
TTL breve; nessun KV/database per restare a costo zero e rispettare il vincolo di non
persistenza. Il rate limit quindi si resetta a ogni riavvio dell'isolate — è un limite noto,
documentato in `BLOCCHI.md`, che con traffico atteso <50 richieste/mese è accettabile come
prima barriera insieme a honeypot e time-trap.

**Alternative scartate:** Cloudflare KV per un rate limit persistente tra isolate — scartata
perché aggiunge un servizio con lettura/scrittura non strettamente necessaria e complica il
vincolo "nessuna persistenza"; Turnstile attivo — scartato perché richiede una registrazione
account Cloudflare Turnstile (non fattibile in autonomia), predisposto solo il punto di
innesto.

**Costo per cambiare idea:** medio — passare a un rate limit persistente richiederebbe
aggiungere un binding KV in `wrangler.toml` e nel dashboard Cloudflare (operazione umana).

---

## 7. Contenuti placeholder: 6 aree di intervento generiche

**Deciso:** ansia, umore, relazioni, crescita personale, fasi di cambiamento, supporto ai
familiari — come da esempio nel prompt, testi informativi e non promozionali, marcati come
bozza.

**Costo per cambiare idea:** basso, sono singole entry Markdown indipendenti gestibili poi
dal CMS.

---

## 8. Dipendenze aggiunte e motivazione

| Pacchetto                                 | Perché                                                                                                 |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `@astrojs/mdx`                            | contenuti MDX per le pagine più ricche (FAQ, aree) mantenendo compatibilità con le content collections |
| `@astrojs/sitemap`                        | generazione automatica di `sitemap.xml` in build, richiesta esplicitamente                             |
| `@lucide/astro`                           | icone da libreria open source, non generate, come richiesto                                            |
| `@tailwindcss/vite`, `tailwindcss`        | CSS utility-first richiesto dal prompt                                                                 |
| `vitest` (dev)                            | test automatici richiesti (content collections, form, antispam)                                        |
| `prettier`, `prettier-plugin-astro` (dev) | formattazione standard richiesta                                                                       |

Nessun'altra dipendenza runtime aggiunta. Niente librerie di componenti UI pesanti.

---

## 9. Form di contatto: risposta duale JSON/HTML in base all'header `Accept`

**Deciso:** la Function `/api/contatto` risponde con JSON quando la richiesta include
`Accept: application/json` (invio potenziato da JavaScript, con validazione inline e
`aria-live`) e con un redirect 303 verso `/contatti/grazie` (successo) o una piccola
pagina HTML di errore (fallimento) quando non lo include — cioè per un invio nativo del
form senza JavaScript. Così il requisito "senza JavaScript la pagina contatti resta
pienamente utilizzabile" è soddisfatto dallo stesso endpoint, senza duplicare la logica.

**Alternative scartate:** due endpoint separati (uno JSON, uno HTML) — scartata perché
duplica validazione/antispam/rate-limit senza benefici.

**Costo per cambiare idea:** basso, la selezione è isolata in `functions/_lib/risposte.ts`.

---

## 10. Honeypot: risposta di "falso successo"

**Deciso:** se il campo honeypot risulta compilato, la Function restituisce comunque un
esito di successo (senza inviare né registrare nulla), invece di un errore esplicito.
È una pratica standard anti-bot: non rivela ai bot automatici che sono stati
riconosciuti, così non imparano a evitare il campo.

**Costo per cambiare idea:** nullo, è un `if` isolato in `functions/api/contatto.ts`.

---

## 11. Time-trap saltato quando manca il timestamp (navigazione senza JavaScript)

**Deciso:** il controllo "invio troppo rapido" si basa su un campo nascosto valorizzato
via JavaScript al caricamento della pagina. Senza JavaScript quel campo resta vuoto: in
quel caso il controllo viene saltato invece di bloccare l'invio, perché non c'è modo di
valutarlo. Restano comunque attivi honeypot e rate limit per IP.

**Perché è accettabile:** i bot di massa quasi sempre eseguono JavaScript per aumentare
l'efficacia (molti moduli di contatto sono protetti lato client), quindi il caso "niente
JS, invio malevolo" è un sottoinsieme piccolo rispetto al traffico atteso; il
compromesso privilegia l'accessibilità/usabilità (requisito esplicito del prompt) sulla
protezione antispam marginale aggiuntiva.

---

## 12. Espressioni adiacenti in Astro: usare un solo template literal, non `{a} {b}`

**Deciso/imparato:** scrivere due espressioni Astro adiacenti su righe separate, es.
`{new Date().getFullYear()}` seguito a capo da `{site.nome}`, perde lo spazio tra le
due quando Prettier va a capo automaticamente (il whitespace tra un `}` e un `{` a
inizio riga viene collassato in fase di compilazione, non solo di formattazione).
In `Footer.astro` questo aveva prodotto "© 2026Elisa Castigliego" senza spazio.
Corretto racchiudendo tutto in un solo template literal: `{` `© ${anno} ${nome}` `}`
— un'unica espressione, che Prettier non può spezzare in un punto che perda lo spazio.

**Come applicarlo:** ogni volta che due valori dinamici vanno concatenati con un
separatore letterale (spazio, trattino...), preferire un singolo template literal a
due espressioni `{a} {b}` adiacenti, per non dipendere da come li andrà a capo
Prettier.

---

## 13. Sveltia CMS aggiornato a 0.209.1 per l'interfaccia in italiano

**Deciso:** la versione inizialmente installata (0.205.4) non includeva una
traduzione italiana dell'interfaccia (pulsanti, menu — i campi dei contenuti erano
già in italiano perché scritti a mano in `config.yml`). Verificato che la 0.209.1
include `it.json`; aggiornata la dipendenza. Sveltia rileva la lingua del browser
automaticamente, quindi con un browser in italiano l'interfaccia comparirà già
tradotta (verificato in locale).

**Costo per cambiare idea:** basso, è un aggiornamento di una singola dipendenza; il
file `config.yml` non è stato toccato.

## 14. Link fisso "Guida all'utilizzo" su `/admin`, pagina guida pubblicata su `/admin/guida`

**Deciso:** per rendere la guida (`/docs/GUIDA-ELISA.md`, prima leggibile solo aprendo
il repository) raggiungibile con un clic dalla stessa schermata del CMS, è stata
creata `src/pages/admin/guida.astro`, che importa e rende lo stesso file Markdown
(fonte unica, nessuna duplicazione) dentro il layout del sito. Su `src/pages/admin/index.astro`
è stato aggiunto un bottone fisso in basso a destra che apre quella pagina in una
nuova scheda. Verificato che Sveltia CMS aggiunge la propria interfaccia al `<body>`
senza svuotarlo, quindi il bottone resta visibile sopra/accanto alla UI del CMS.

**Alternative scartate:** cercare un'opzione nativa di Sveltia per un link di aiuto
personalizzato — non esiste nella configurazione (`display_url` è solo un link al
sito pubblico, non un link libero).

**Costo per cambiare idea:** basso — è un singolo elemento HTML con poco CSS in linea.

---

## 15. Foto del ritratto editabile dal CMS, con fallback al segnaposto ottimizzato

**Deciso:** aggiunto un campo immagine "Foto del ritratto" in `dati-sito.json` /
`config.yml`. `RitrattoElisa.astro` ora sceglie tra due percorsi: se il campo è
vuoto (default), usa ancora l'import statico di `placeholder.jpeg` tramite
`astro:assets` (ottimizzazione WebP + resize automatico); se è valorizzato dal
CMS, renderizza un `<img>` semplice puntando al file caricato in
`public/immagini-cms/`.

**Perché non un'unica soluzione ottimizzata:** la pipeline immagini di Astro
richiede un import statico noto a tempo di build per ottimizzare davvero
un'immagine (resize, conversione WebP); un percorso che può cambiare a piacere
via CMS non può passarci allo stesso modo. Si è scelto di sacrificare
l'ottimizzazione automatica per la foto caricata da Elisa, a favore di una reale
autonomia editoriale — era la richiesta esplicita.

**Costo per cambiare idea:** medio-basso. Se in futuro servisse ottimizzare anche
la foto caricata dal CMS, si potrebbe aggiungere una Cloudflare Pages Function o
un Image Resizing di Cloudflare lato CDN; non necessario oggi vista la scala del
sito.

## 16. Anteprima dell'email visibile nel browser in modalità mock

**Deciso:** il driver `mock` del form di contatto ora restituisce (solo alla
Function, mai nei log) il testo completo dell'email che sarebbe partita; la
Function lo include nella risposta JSON solo quando presente; `ContactForm.astro`
lo mostra in un riquadro "Anteprima email" dopo un invio riuscito. Richiesto per
poter mostrare alla cliente, in una call, cosa succede davvero quando si invia il
form, senza dover leggere log oscurati nel terminale.

**Perché non viola il vincolo di privacy/non-persistenza:** il testo torna solo
al browser della stessa persona che ha appena scritto quei dati (non a terzi, non
salvato, non loggato in chiaro sul server — i log restano oscurati come prima).
Il driver `brevo` (produzione) non valorizza mai questo campo: in produzione
questa anteprima non compare mai, a prescindere da cosa succeda nel browser.

**Costo per cambiare idea:** basso — un campo opzionale (`anteprimaEmail`) su un
tipo esistente, popolato da un solo driver.

---

## 17. Protezione di `/admin`: Basic Auth via middleware, non un servizio esterno

**Deciso:** scritto `functions/_middleware.ts`, che applica HTTP Basic Auth a
`/admin` e ogni sotto-percorso, attiva solo se sono impostate due variabili
d'ambiente (assenti di default). Consigliata anche Cloudflare Access come
protezione più solida, ma non attivabile in autonomia (richiede il dashboard
Cloudflare) — documentata in `/docs/DEPLOY.md`.

**Perché non solo Cloudflare Access:** Access richiede una configurazione
nell'account Cloudflare, non fattibile in questa sessione. Basic Auth invece è
puro codice, attivabile subito con due secret, quindi una protezione reale è
disponibile da subito invece di restare bloccata in attesa di un passaggio
manuale.

**Costo per cambiare idea:** basso — rimuovere `functions/_middleware.ts` (o
semplicemente non impostare le due variabili) riporta `/admin` allo stato
precedente, senza toccare nient'altro.

## 18. Messaggio di conferma del form più caldo, meno informativo

**Deciso:** il messaggio dopo l'invio del form è passato da un testo
informativo ("verrà riscontrato secondo i tempi indicati...") a uno più
personale ("Grazie per aver scritto, ti contatterò il prima possibile!"), su
richiesta esplicita. L'informazione sui tempi di risposta resta comunque
disponibile nella pagina Emergenze, che il messaggio linka già in altri punti
del sito (footer, pagina emergenze).

## 19. Nota "da rimuovere" nella pagina contatti, in corsivo

**Deciso:** il paragrafo che spiega il funzionamento tecnico del modulo
("funziona anche senza JavaScript") è stato reso in corsivo con un'etichetta
esplicita `[Nota per Elisa — rimuovi questo paragrafo prima di pubblicare il
sito:]`, seguendo lo stesso principio già usato per `[BOZZA]` altrove nel sito:
segnalare in modo inequivocabile cosa è contenuto provvisorio.

## 20. Sfondi fotografici decorativi: foto reali con licenza libera, non generate

**Deciso:** aggiunte due fotografie (non generate da IA, licenza Unsplash
libera per uso commerciale) come sfondo molto discreto (opacità 7-10%) in due
punti del sito. Scelte deliberatamente **astratte** (trama di tessuto, tegole
in terracotta) invece di foto "a tema psicologia" (persone, mani, divani), per
restare coerenti con l'istruzione originale di evitare l'immaginario da stock
tipico del settore. Dettagli, fonti e licenze in `/docs/ASSETS.md`.

**Scelta tecnica rilevante:** implementate come componente `<Image>` di Astro
(elemento `<img>`, governato da `img-src` nella CSP) e non come
`background-image` via attributo `style` inline — quest'ultimo sarebbe stato
bloccato dalla Content Security Policy (`style-src` senza `unsafe-inline`,
scelta deliberatamente restrittiva, vedi fase 7). Aggiunto anche un test
(`tests/headers.test.ts`) che verifica che nessuna pagina prodotta in build
contenga attributi `style="..."`, per non reintrodurre il problema in futuro.

## 21. Footer centrato, credito sviluppatore con link solo sul nome

**Deciso:** contenuto del footer allineato al centro (richiesta esplicita) e
aggiunta la riga "Sviluppato da Gianluigi Ribezzo" dopo il copyright, con link
a `gianluigiribezzo.dev` **solo** sul nome (non sull'intera riga), `target="_blank"`
perché è un link in uscita dal sito.

## 22. Cookie policy: rimossi i riferimenti a `/admin` e `/demo-prenotazione`

**Deciso:** la sezione sul local storage non nomina più i percorsi tecnici
`/admin`/`/demo-prenotazione` (visibili solo a chi ci lavora, non rilevanti per
chi visita il sito) ma parla genericamente di "strumenti riservati a chi
gestisce il sito". Rimossa anche la sezione finale "Verifica" (nota di
sviluppo, non contenuto per il pubblico), su richiesta esplicita.

---

## 23. Sito ridotto all'osso: una home con tre sezioni, contatti e pagine legali

**Deciso (su richiesta esplicita):** rimosse le pagine Chi sono, Aree di intervento
(le schede con etichette diagnostiche), Come lavoro, FAQ (incluse tariffe e
"come funziona il primo colloquio") e la demo di prenotazione, con le relative
collezioni del CMS. La home ora contiene tre sezioni — Mi presento, Di cosa mi
occupo, La mia formazione — con i testi forniti dalla dott.ssa, riportati alla
lettera, ognuna con una foto. Restano: Contatti (con il modulo), Emergenze, Privacy,
Cookie policy, Note legali, 404.

Altre modifiche richieste nello stesso passaggio:

- **Niente telefono né WhatsApp** finché non c'è un numero dedicato allo studio. I
  campi restano nel CMS (vuoti) e vengono mostrati solo se compilati, così riattivarli
  non richiede modifiche al codice. Tolta dal modulo di contatto l'opzione "ricontattami
  su WhatsApp" (il numero di telefono di chi scrive resta come recapito facoltativo).
- **Nessun indirizzo dello studio**: ovunque compare solo "San Lazzaro di Savena –
  Bologna" (anche nel JSON-LD, senza via e CAP). Rimossi orari e mappa.
- **Solo in presenza**: eliminati tutti i riferimenti ai colloqui online.
- **Dati reali** inseriti: Ordine degli Psicologi dell'Emilia-Romagna n. 11846,
  P. IVA, email, PEC. Rimosso il codice fiscale (non fornito; la P. IVA basta).

**Default scelti senza conferma esplicita (facili da invertire):** rimossa la demo
di prenotazione (coerente con "ridurre all'osso"), mantenuti il modulo di contatto e
la pagina Emergenze. Nessun testo descrittivo aggiunto in home oltre a nome,
qualifica e località. (Aggiornamento su richiesta di Elisa: "Mi presento" inizia con "Sono la Dott.ssa…" ed è seguito da "Ricevo in presenza a San Lazzaro di Savena."; tolto ovunque "solo" da "solo in presenza".)

**Foto**: abbinate per nome file (`src/assets/foto/<id-sezione>.<ext>`) tramite
`import.meta.glob`, così passano dall'ottimizzazione di Astro e una foto mancante
non rompe la build (compare un riquadro "Foto in arrivo"). Le foto non sono
caricabili dal CMS: scelta voluta per mantenerle ottimizzate (vedi decisione 15 per
il compromesso opposto, ora non più necessario).

**Costo per cambiare idea:** basso — le pagine rimosse sono recuperabili dalla
storia git (commit precedente a questo).

---

## 24. Pubblicazione su GitHub Pages con base path e modulo disattivabile

**Deciso:** il primo deploy su GitHub Pages falliva perché Pages usava Jekyll. Aggiunto
un workflow Actions che compila Astro e pubblica `dist/`. Poiché GitHub Pages serve il
sito in una sottocartella, `astro.config.mjs` legge `SITE_URL`/`BASE_PATH` dall'ambiente
e tutti i link interni passano da `percorso()`. Il modulo di contatto, che richiede una
Function, è sostituito sulla build GitHub Pages da un riquadro email
(`PUBLIC_MODULO_CONTATTO=off`), per non far credere a chi scrive di aver inviato un
messaggio che non arriverebbe mai.

**Costo per cambiare idea:** nullo per tornare a Cloudflare Pages: senza quelle
variabili la build è identica a prima (base `/`, modulo attivo).

---

## 25. Messa online su Netlify: SEO, metadati, pagine legali definitive

**Deciso:** hosting di produzione su Netlify con dominio registrato su Aruba.

- (Superato dal §28: ora il dominio è fisso in `astro.config.mjs`.) Il dominio arrivava in build dalla variabile `URL` di Netlify,
  quindi non è scritto nel codice; `robots.txt` è generato in build
  (`src/pages/robots.txt.ts`) e punta sempre alla sitemap giusta.
- Bot: tutti ammessi, compresi quelli dei servizi di IA (scelta esplicita); esclusi
  solo `/admin/` e la pagina di ringraziamento. Copie di anteprima (GitHub Pages,
  deploy preview di Netlify) marcate `noindex` con `PUBLIC_NOINDEX=on`, per non
  creare contenuti duplicati.
- Metadati: robots con `max-image-preview:large`, Open Graph/Twitter con la foto di
  "Mi presento" ritagliata 1200×630, `theme-color`, `author`; rimosso
  `generator`. JSON-LD `Psychologist` (con località, area servita, foto) e `WebSite`.
- Prestazioni: sfondi decorativi ricompressi (sono al 7-10% di opacità), foto
  delle sezioni responsive (384/768 px), cache di un anno per `/_astro/*`, HSTS.
- Pagine legali riscritte come testi definitivi (rimosse tutte le note di bozza):
  privacy con hosting Netlify, contatti via email/PEC, minori, diritti; numeri di
  supporto scelti con l'utente (Telefono Azzurro 19696, Telefono Amico Italia
  02 2327 2327, oltre al 112), da verificare prima della pubblicazione.
- Foto: ritaglio 4:5 con allineamento scelto per foto (`allineamentoFoto`, anche dal CMS).

---

## 26. Stile "Quaderno di osservazione" e rifinitura degli spazi

**Deciso (richiesta: meno bottoni arrotondati, stile unico, mobile curato):**
evoluta la Direzione A in un'impaginazione editoriale (dettagli in
`/docs/DESIGN.md`): angoli vivi, niente ombre, sezioni numerate, cornice sfalsata
sulle foto, foto sticky su desktop, indice delle sezioni nell'hero, griglia a 12
colonne con margine sinistro comune a tutte le pagine (anche quelle legali), ritmo
verticale uniforme (`py-14 / sm:py-20 / md:py-28`). Nessun testo nuovo aggiunto
oltre alle etichette di servizio ("In questa pagina").

**Costo per cambiare idea:** basso per i colori/angoli (solo `tokens.css`), medio
per la struttura della home (`src/pages/index.astro`).

---

## 27. Modulo di contatto e protezione di `/admin` portati su Netlify

**Deciso:** la logica del modulo è stata estratta in
`functions/_lib/gestore-contatto.ts`, usata sia dalla Cloudflare Pages Function sia
dalla nuova Netlify Function (`netlify/functions/contatto.ts`, path `/api/contatto`).
Il controllo Basic Auth è in `functions/_lib/accesso-admin.ts`, usato dal middleware
Cloudflare e dalla Netlify Edge Function `netlify/edge-functions/proteggi-admin.ts`.
Nessuna logica duplicata, stessi test.

**Salvaguardie:** su Netlify il modulo compare solo se in build ci sono
`MAIL_DRIVER=brevo` e `BREVO_API_KEY` (`src/lib/modulo-contatto.ts`); in produzione la
function risponde 503 invece di usare il driver finto. Così nessuno può inviare un
messaggio che non arriva.

**Limite noto (invariato):** il rate limit resta in memoria della singola istanza
della function, come su Cloudflare (vedi `BLOCCHI.md` voce 5).

---

## 28. Dominio ufficiale fisso: www.elisacastigliegopsicologa.it

**Deciso:** il dominio è scritto in `astro.config.mjs` invece di arrivare dalla
variabile `URL` di Netlify. Prima che il dominio sia collegato, `URL` varrebbe
l'indirizzo provvisorio `*.netlify.app`, e canonical, sitemap e Open Graph lo
seguirebbero fino al deploy successivo. Con il dominio fisso puntano sempre a quello
ufficiale. Versione principale con `www`, come consiglia Netlify; il dominio senza
`www` reindirizza. Guida operativa: `/docs/MESSA-ONLINE.md`.

---

## 29. Tolta l'illustrazione senza permesso; anteprima di condivisione senza foto

**Deciso:** l'illustrazione di "La mia formazione" (opera firmata di terzi) è stata
rimossa: senza il permesso del titolare dei diritti non è pubblicabile, e citare
l'autrice o modificare i testi non sostituisce il permesso. Senza foto, una sezione
della home passa automaticamente a due colonne (titolo a sinistra, testo a destra)
invece di mostrare un riquadro vuoto.

L'anteprima quando il link viene condiviso (Open Graph/Twitter) non usa più il
ritratto: su richiesta, finché non c'è un logo resta senza immagine. Il logo andrà in
`src/assets/social/anteprima.png` e verrà usato da solo. Il ritratto resta solo nei
dati strutturati per Google (JSON-LD), che non influiscono sulle anteprime.

---

## 30. Colori del sito modificabili dal CMS; CSP dedicata per /admin

**Deciso (richiesta della cliente):** nuova sezione del CMS "Colori del sito"
(`src/content/tema.json`, widget colore di Sveltia) per 7 colori: sfondo, sfondo
alternato, testo, testo secondario, colore principale, etichette, bordi. Il colore
"hover" dei pulsanti e il colore del testo sui pulsanti sono calcolati da soli. I
colori diventano in build un foglio di stile statico `/tema.css`
(`src/pages/tema.css.ts`), non uno stile in linea: la CSP delle pagine pubbliche
resta invariata.

**Salvaguardia di accessibilità:** `src/lib/tema.ts` verifica il contrasto WCAG AA
(4,5:1) di testo, testo secondario, colore principale ed etichette su entrambi gli
sfondi; una voce non leggibile torna al valore originale (avviso nel log di build).
Il controllo ha trovato subito un problema reale nella palette originale: il
terracotta `#b5502d` arrivava solo a 4,22:1 sullo sfondo alternato (numeri delle
sezioni). È stato scurito del 5% in `#ac4c2b` (5,11 e 4,58:1; testo bianco sui
pulsanti 5,49:1), differenza non percepibile.

**Bug trovato e corretto:** la CSP restrittiva si applicava anche a `/admin`, dove
Sveltia carica da CDN font, icone e traduzioni (`cdn.jsdelivr.net`, `unpkg.com`) e
usa stili in linea: in produzione l'interfaccia sarebbe comparsa rotta e in
inglese. Ora `/admin` ha una CSP dedicata con le sole eccezioni necessarie
(`scripts/generate-headers.mjs`), verificata in un browser senza violazioni; le
pagine pubbliche restano senza `unsafe-inline` né domini terzi (test in
`tests/headers.test.ts`).

---

## 31. Logo come anteprima di condivisione

**Deciso:** il logo fornito (JPEG 1600×1600 con angoli neri al posto della
trasparenza) è stato ritagliato lungo il cerchio con un bordo antialias
(`src/assets/logo/logo.png`, trasparente) e centrato su una tela 1200×630 con lo
sfondo crema del sito (`src/assets/social/anteprima.png`). In build l'immagine
Open Graph è un JPEG di circa 33 KB invece di un PNG di circa 230 KB: alcune app,
WhatsApp compreso, possono ignorare anteprime troppo pesanti. Il logo circolare
resta intero anche quando un'app ritaglia l'anteprima a quadrato.

---

## 32. Keep-alive settimanale della chiave API di Brevo

**Deciso:** la chiave API di Brevo (accesso limitato a "Email transazionali") scade
dopo 90 giorni di inutilizzo; con poche richieste dal modulo potrebbe succedere,
e il modulo smetterebbe di inviare. `netlify/functions/brevo-keepalive.ts` è una
Netlify Scheduled Function (`@weekly`) che fa una GET di sola lettura alle
statistiche delle email transazionali: nessun invio, nessuna modifica, nessun
costo. Se Brevo risponde con un errore (chiave scaduta o revocata), lo segnala nei
log della function.

---

## 33. Login del CMS tramite il provider OAuth di Netlify

**Deciso:** con il sito su Netlify, il login GitHub di Sveltia usa il provider OAuth
integrato di Netlify (`base_url: https://api.netlify.com` in `config.yml`) invece del
Worker Cloudflare: niente servizi aggiuntivi da pubblicare, solo una GitHub OAuth
App registrata in Netlify. Prima `base_url` era ancora il segnaposto
`{{URL_WORKER_OAUTH}}`, e "Accedi con GitHub" portava a una pagina 404. Il Worker
resta nel repository come alternativa in caso di passaggio a Cloudflare.

---

_Le decisioni successive vengono aggiunte in fondo a questo file man mano che emergono._
