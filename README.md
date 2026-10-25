# Sito della Dott.ssa Elisa Castigliego — Psicologa (San Lazzaro di Savena, Bologna)

Sito professionale statico, realizzato con [Astro](https://astro.build) e Tailwind CSS.
Nessun contenuto generato da IA, nessun tracciamento, costi ricorrenti pari a zero
(a parte il dominio). Vedi `/docs/DECISIONI.md` per le scelte di progetto e
`/docs/BLOCCHI.md` per ciò che resta da fare a mano.

## Avvio rapido

```bash
npm install
npm run dev
```

Il sito sarà disponibile su `http://localhost:4321`.

Il CMS (Sveltia CMS) è raggiungibile su `http://localhost:4321/admin` e in sviluppo
locale funziona senza credenziali, leggendo e scrivendo direttamente i file del
repository (backend locale "proxy"). Vedi `/docs/CMS.md`.

## Variabili d'ambiente

Il form di contatto è gestito da una Cloudflare Pages Function (`/functions/api/contatto.ts`).
Per provarla in locale con Wrangler:

```bash
cp .dev.vars.example .dev.vars
npm run dev:functions
```

- `MAIL_DRIVER=mock` (default): non invia nessuna email reale, stampa in console un
  riepilogo con i campi oscurati.
- `MAIL_DRIVER=brevo`: invia davvero tramite l'API Brevo. Richiede `BREVO_API_KEY`.
  Vedi `/docs/DEPLOY.md`.

Nel semplice `npm run dev` (senza Wrangler) la function non gira: il form userà comunque
la validazione lato client e, se raggiunta, l'endpoint risponderà con un mock statico
in fase di sviluppo puro Astro. Per testare il flusso completo usare `npm run dev:functions`.

## Script disponibili

| Comando                 | Cosa fa                                                    |
| ----------------------- | ---------------------------------------------------------- |
| `npm run dev`           | Avvia Astro in sviluppo                                    |
| `npm run dev:functions` | Avvia Astro + Pages Function via Wrangler (richiede build) |
| `npm run build`         | Build statica di produzione in `dist/`                     |
| `npm run preview`       | Anteprima della build                                      |
| `npm run lint`          | Controllo formattazione con Prettier                       |
| `npm run format`        | Applica la formattazione con Prettier                      |
| `npm test`              | Esegue i test (Vitest): form, antispam, link, CSP          |
| `npm run check`         | Type-check di Astro                                        |

## Struttura del progetto

```
src/
  assets/foto/      le tre foto della home (mi-presento, di-cosa-mi-occupo, la-mia-formazione)
  components/       componenti Astro riutilizzabili
  config/site.ts    dati del sito (contatti, indirizzo, social) — con segnaposto
  content/          content collections (sezioni della home, pagine, dati del sito) — gestite dal CMS
  layouts/          layout di pagina condivisi
  pages/            rotte del sito
  styles/           token di design e CSS globale
functions/          Cloudflare Pages Functions (API del form di contatto)
public/admin/       Sveltia CMS (interfaccia statica)
worker-oauth/       Worker Cloudflare per l'autenticazione GitHub del CMS (non collegato)
docs/               documentazione del progetto (leggere prima di tutto DECISIONI.md e REPORT.md)
tests/              test automatici (Vitest)
```

## Documentazione

- `/docs/REPORT.md` — stato del progetto, cosa manca, cosa verificare
- `/docs/DECISIONI.md` — decisioni prese in autonomia e alternative scartate
- `/docs/BLOCCHI.md` — cosa è stato bloccato e perché
- `/docs/DA-COMPILARE.md` — checklist dei segnaposto da sostituire con dati reali
- `/docs/GUIDA-ELISA.md` — guida non tecnica per modificare i contenuti dal CMS
- `/docs/CMS.md` — configurazione di Sveltia CMS e registrazione della GitHub App
- `/docs/DEPLOY.md` — pubblicazione su Cloudflare Pages, DNS, email, Brevo
- `/docs/DESIGN.md` — sistema di design e le tre direzioni proposte
- `/docs/ASSETS.md` — elenco degli asset visivi mancanti
- `/docs/ACCESSIBILITY.md` — verifica WCAG 2.2 AA
- `/docs/PRIVACY.md` — mappa dei dati trattati dal sito
- `/docs/ROADMAP.md` — cosa servirebbe per una prenotazione online reale (la demo è stata rimossa)

## Licenza dei contenuti

I testi delle tre sezioni della home sono stati forniti dalla professionista. Le pagine
legali restano bozze da verificare (vedi `/docs/DA-COMPILARE.md`).
