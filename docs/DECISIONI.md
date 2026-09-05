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

| Pacchetto | Perché |
|---|---|
| `@astrojs/mdx` | contenuti MDX per le pagine più ricche (FAQ, aree) mantenendo compatibilità con le content collections |
| `@astrojs/sitemap` | generazione automatica di `sitemap.xml` in build, richiesta esplicitamente |
| `@lucide/astro` | icone da libreria open source, non generate, come richiesto |
| `@tailwindcss/vite`, `tailwindcss` | CSS utility-first richiesto dal prompt |
| `vitest` (dev) | test automatici richiesti (content collections, form, antispam) |
| `prettier`, `prettier-plugin-astro` (dev) | formattazione standard richiesta |

Nessun'altra dipendenza runtime aggiunta. Niente librerie di componenti UI pesanti.

---

_Le decisioni successive vengono aggiunte in fondo a questo file man mano che emergono._
