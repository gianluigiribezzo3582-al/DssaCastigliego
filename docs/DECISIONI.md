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

## 14. Link fisso "Guida per Elisa" su `/admin`, pagina guida pubblicata su `/admin/guida`

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

_Le decisioni successive vengono aggiunte in fondo a questo file man mano che emergono._
