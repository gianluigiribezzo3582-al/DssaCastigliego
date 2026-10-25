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

**Lingua dell'interfaccia**: le etichette dei campi (quelle scritte in `config.yml`)
sono in italiano indipendentemente da tutto. L'interfaccia del programma (pulsanti,
menu) segue invece la lingua del browser di chi la usa: con un browser impostato in
italiano compare già tradotta (pacchetto `@sveltia/cms` ≥ 0.209, che include la
traduzione italiana — versione in uso in questo repository).

**Guida sempre a portata di clic**: su `/admin` c'è un bottone fisso "Guida
all'utilizzo" in basso a destra, che apre `/admin/guida` — la stessa guida di
`/docs/GUIDA-ELISA.md`, pubblicata come pagina del sito per essere raggiungibile
anche una volta online, non solo aprendo il repository.

## Login con GitHub tramite Netlify (procedura attuale)

Su `/admin` ci sono due accessi distinti:

1. **La password della pagina** (`ADMIN_BASIC_AUTH_USER`/`PASS` su Netlify): tiene
   fuori gli estranei.
2. **"Accedi con GitHub"**: serve a Sveltia per **salvare**. Ogni modifica diventa
   un commit su `main` e Netlify ripubblica il sito da solo in un paio di minuti.

Per il secondo accesso si usa il provider OAuth integrato in Netlify (già impostato
in `public/admin/config.yml`: `base_url: https://api.netlify.com`), senza servizi
aggiuntivi. Configurazione una tantum:

**A. Crea una GitHub OAuth App** (account `gianluigiribezzo3582-al`)

1. github.com → foto profilo → **Settings → Developer settings → OAuth Apps → New
   OAuth App**.
2. Compila:
   - **Application name**: `CMS Elisa Castigliego`
   - **Homepage URL**: `https://www.elisacastigliegopsicologa.it`
   - **Authorization callback URL**: `https://api.netlify.com/auth/done`
3. **Register application** → copia il **Client ID** → **Generate a new client
   secret** e copia anche quello (si vede una sola volta).

**B. Installa il provider su Netlify**

Netlify → il progetto → **Project configuration → Access & security → OAuth →
Authentication providers → Install provider → GitHub** → incolla Client ID e Client
secret → **Install**.

**C. Chi può salvare**

Può salvare solo chi ha un account GitHub con permesso di scrittura sulla
repository: il proprietario (tu) e i collaboratori invitati (vedi Passo 6 più sotto
per dare accesso a Elisa).

**D. Prova**

Apri `https://www.elisacastigliegopsicologa.it/admin/`, inserisci la password della
pagina, poi **Accedi con GitHub** → autorizza l'app nel popup. Modifica un testo,
**Salva**, e controlla che in GitHub compaia un nuovo commit e che Netlify faccia
un nuovo deploy.

## Alternativa (non usata): login tramite Worker Cloudflare

Se in futuro il sito passasse a Cloudflare Pages, il login si può fare con il Worker
già scritto in `worker-oauth/src/index.ts` (stesso protocollo di Decap CMS: popup +
`postMessage`) e una GitHub App. In quel caso in `config.yml` `base_url` va
sostituito con l'indirizzo del Worker. Procedura:

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

### Passo 6 — Dare accesso a chi modificherà davvero i contenuti (es. Elisa)

(Vale per entrambe le procedure, Netlify o Worker.)

Il login "con GitHub" autentica sempre una persona tramite un **account GitHub
reale**: non esiste un accesso anonimo o condiviso senza account. Questo vale
anche per Elisa: per poter salvare modifiche (non solo lavorare in locale) le
serve un account GitHub proprio, aggiunto come collaboratore della repository.
Due strade, entrambe valide:

- **Account personale di Elisa**: ne crea uno gratuito su github.com (basta
  un'email), e va invitata come collaboratrice della repository
  (**Settings → Collaborators → Add people** sulla repository GitHub).
- **Un account unico per lo studio** (es. `studio.castigliego`), creato una volta
  sola e usato solo per questo scopo, se si preferisce non legare l'accesso alla
  sua identità personale — stesso procedimento, invitato come collaboratore.

In entrambi i casi è un'operazione da pochi minuti, una tantum: dopo aver accettato
l'invito (arriva via email), l'accesso a `/admin` resta valido finché non viene
rimosso. Nessuno di questi due passaggi (creare l'account, invitarlo) è stato
fatto in autonomia in questa sessione, per lo stesso motivo per cui non è stata
creata la GitHub App: richiede un account reale, di cui solo voi potete decidere
titolarità e credenziali.

## Struttura delle collezioni

| Collezione                   | Cosa contiene                                                                                    | File                         |
| ---------------------------- | ------------------------------------------------------------------------------------------------ | ---------------------------- |
| Pagine del sito              | Home, Chi sono, Come lavoro                                                                      | `src/content/pagine/*.md`    |
| Aree di intervento           | Le schede delle aree (ansia, relazioni...)                                                       | `src/content/aree/*.md`      |
| Domande frequenti            | Le voci della pagina FAQ                                                                         | `src/content/faq/*.md`       |
| Contatti e dati dello studio | Email, telefono, WhatsApp, indirizzo, orari, Albo, P.IVA, numeri di emergenza, foto del ritratto | `src/content/dati-sito.json` |

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
