# CMS — Sveltia CMS

Il sito usa [Sveltia CMS](https://github.com/sveltia/sveltia-cms) (fork moderno e
mantenuto di Decap CMS, stessa `config.yml`) come redattore di contenuti su `/admin`.
Perché Elisa possa lavorare senza toccare codice, i suoi salvataggi diventano commit
Git che ricompilano automaticamente il sito su Cloudflare Pages.

## Cosa funziona già, senza fare nulla

Con `npm run dev` (o `npm run build && npm run preview`), aprendo `http://localhost:4321/admin`
compare il pulsante **"Lavora con la repository locale"**: selezionando la cartella del
progetto, Sveltia CMS legge e scrive direttamente i file Markdown/JSON del repository
tramite l'API del browser, senza bisogno di alcuna credenziale né di GitHub. È il modo
più comodo per esplorare l'interfaccia e provare le modifiche prima di pubblicare
davvero il sito. Vedi `/docs/GUIDA-ELISA.md` per l'uso quotidiano.

Il bundle di Sveltia CMS (`public/admin/sveltia-cms.js`) è **self-hosted**: viene
copiato automaticamente da `node_modules` ad ogni `npm run dev`/`npm run build`
(script `scripts/copy-cms.mjs`), non viene mai scaricato da un CDN esterno.

## Cosa NON funziona ancora: il login "vero" con GitHub

In produzione, per permettere a Elisa di accedere da qualunque computer (non solo dal
proprio, con la repository locale), serve un login GitHub via OAuth. Questo richiede
una **GitHub App**, che non è stata creata: la sua creazione richiede un account
GitHub con diritti di amministrazione sul repository, che l'esecuzione autonoma di
questa sessione non doveva né poteva effettuare (vedi `/docs/BLOCCHI.md`).

Il codice del Worker Cloudflare che gestisce il login (`worker-oauth/src/index.ts`) è
però **scritto per intero e pronto**: implementa lo stesso protocollo usato da Decap
CMS (popup + `postMessage`), non richiede altre dipendenze, e va semplicemente
pubblicato e collegato. Ecco la procedura.

### Passo 1 — Creare la repository su GitHub (se non esiste già)

Questa sessione ha lavorato in un repository Git locale, mai collegato a un remoto.
Prima di tutto va creata una repository su GitHub e va fatto il push del codice
(`git remote add origin ...`, `git push`).

### Passo 2 — Creare la GitHub App

1. Vai su **github.com → icona del profilo → Settings**.
2. Nel menu a sinistra, in fondo, scegli **Developer settings**.
3. Scegli **GitHub Apps → New GitHub App**.
4. Compila:
   - **GitHub App name**: un nome a scelta, es. "CMS sito Elisa Castigliego".
   - **Homepage URL**: l'indirizzo del sito pubblico (es. `https://www.dominio-scelto.it`).
   - **Callback URL**: l'indirizzo del Worker OAuth seguito da `/callback`
     (lo si conosce solo dopo il Passo 3 — si può tornare a modificarla in seguito
     da "Edit" sulla GitHub App).
   - **Webhook**: disattiva la spunta "Active" (non serve un webhook).
   - **Permissions → Repository permissions → Contents**: imposta "Read and write".
   - **Permissions → Repository permissions → Metadata**: "Read-only" (obbligatorio).
   - **Where can this GitHub App be installed?**: "Only on this account".
5. Crea l'App. Nella pagina che si apre, annota il **Client ID**.
6. Sotto "Client secrets", genera un **Client secret** e copialo subito (non sarà
   più visibile dopo aver lasciato la pagina).
7. In fondo alla pagina, scegli **Install App** e installala sulla repository del
   sito.

### Passo 3 — Pubblicare il Worker OAuth

Dalla cartella `worker-oauth/`:

```bash
cd worker-oauth
cp wrangler.toml.example wrangler.toml
# modifica ALLOWED_ORIGINS in wrangler.toml con il dominio reale del sito
npx wrangler login
npx wrangler secret put GITHUB_CLIENT_ID
npx wrangler secret put GITHUB_CLIENT_SECRET
npx wrangler deploy
```

Al termine, Wrangler mostra l'URL pubblicato, del tipo
`https://elisa-castigliego-cms-auth.<account>.workers.dev`. Torna alla GitHub App
(Passo 2) e imposta la **Callback URL** su `<quell'URL>/callback`.

### Passo 4 — Collegare il Worker a Sveltia CMS

In `public/admin/config.yml`, sostituisci:

```yaml
backend:
  name: github
  repo: "NOMEUTENTE/NOME-REPOSITORY"
  branch: main
  base_url: "https://elisa-castigliego-cms-auth.<account>.workers.dev"
```

Fai commit e push: dopo la ricompilazione automatica su Cloudflare Pages, su
`/admin` comparirà anche il pulsante "Login with GitHub", che apre il flusso OAuth
appena configurato.

### Passo 5 — Verifica

Apri `/admin` sul sito pubblicato, scegli "Login with GitHub", autorizza l'app: si
dovrebbe tornare alla schermata di redazione con l'elenco delle collezioni (Pagine,
Aree di intervento, FAQ, Contatti e dati dello studio).

## Struttura delle collezioni

| Collezione                   | Cosa contiene                                                                 | File                         |
| ---------------------------- | ----------------------------------------------------------------------------- | ---------------------------- |
| Pagine del sito              | Home, Chi sono, Come lavoro                                                   | `src/content/pagine/*.md`    |
| Aree di intervento           | Le schede delle aree (ansia, relazioni...)                                    | `src/content/aree/*.md`      |
| Domande frequenti            | Le voci della pagina FAQ                                                      | `src/content/faq/*.md`       |
| Contatti e dati dello studio | Email, telefono, WhatsApp, indirizzo, orari, Albo, P.IVA, numeri di emergenza | `src/content/dati-sito.json` |

Le etichette dei campi in `config.yml` sono scritte in italiano semplice, pensate per
chi non ha familiarità con il codice (es. "Titolo per la scheda del browser e per
Google" invece di "meta title"). Non ci sono campi tecnici (slug, redirect) esposti
all'utente: gli slug delle pagine sono fissi o generati automaticamente dal titolo.

## Se Sveltia CMS dovesse dare problemi

Il prompt originale prevede, in caso di problemi di integrazione, il ripiego su
**Decap CMS**: non è stato necessario (vedi `/docs/DECISIONI.md`, voce 5). Se in futuro
servisse comunque, `config.yml` è già compatibile: basterebbe sostituire lo script
caricato in `src/pages/admin/index.astro` con il bundle di `decap-cms` (stesso
procedimento di self-hosting via `scripts/copy-cms.mjs`, adattando il pacchetto npm).
