# Deploy — pubblicazione su Cloudflare Pages

Nessuna di queste operazioni è stata eseguita in autonomia (richiedono un account
Cloudflare, l'acquisto di un dominio, e in generale azioni con conseguenze esterne
vietate dalle regole della sessione). Procedura passo-passo per un umano.

## 1. Dominio

Acquistare il dominio scelto presso un registrar a piacere (anche non Cloudflare).
Se possibile, usare **Cloudflare Registrar** o comunque puntare i nameserver a
Cloudflare: semplifica tutti i passaggi successivi (Pages, Email Routing, DNS).

## 2. Cloudflare Pages

1. Push del repository su GitHub (necessario anche per il CMS, vedi `/docs/CMS.md`).
2. Su dashboard Cloudflare → **Workers & Pages → Create → Pages → Connect to Git**,
   selezionare la repository.
3. Impostazioni di build:
   - **Framework preset**: Astro
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/` (radice del repository)
4. Variabili d'ambiente (Settings → Environment variables), per l'ambiente di
   produzione:
   - `MAIL_DRIVER` = `mock` finché non si è pronti per l'invio reale (vedi punto 5 sotto),
     poi `brevo`
   - `BREVO_API_KEY` (secret, solo quando si passa a `brevo`)
   - `BREVO_MITTENTE_EMAIL`, `BREVO_MITTENTE_NOME`, `DESTINATARIO_EMAIL`
   - `RATE_LIMIT_SALT` (una stringa segreta a caso, diversa da quella di sviluppo)
   - `TURNSTILE_SECRET_KEY` — lasciare vuota finché Turnstile non viene attivato
5. Deploy: ogni push su `main` ricompila e pubblica automaticamente.
6. Collegare il dominio personalizzato in **Custom domains**.

Dopo il primo deploy, aggiornare i tre punti che referenziano il dominio segnaposto
(vedi `/docs/DA-COMPILARE.md`, sezione 5) e fare un nuovo commit.

## 3. Proteggere `/admin` da accessi esterni

`/admin` non deve restare raggiungibile da chiunque indovini l'indirizzo. Ci sono
due livelli, non alternativi — il primo è già scritto e pronto, va solo attivato;
il secondo è consigliato ma richiede un passaggio in più nel dashboard.

### 3.1 Basic Auth (già scritto, attivalo subito)

Una password semplice, verificata da `functions/_middleware.ts` prima di mostrare
qualunque cosa sotto `/admin` (pagina compresa, non solo il login del CMS).
Finché le due variabili sotto non sono impostate, `/admin` resta aperto come oggi
— quindi vanno impostate **prima** di considerare il sito pubblicato:

1. Dashboard Cloudflare Pages → progetto → **Settings → Environment variables**
   (ambiente di produzione).
2. Aggiungi **come secret** (non variabile in chiaro):
   - `ADMIN_BASIC_AUTH_USER` — un nome utente a scelta
   - `ADMIN_BASIC_AUTH_PASS` — una password robusta, diversa da qualunque altra
     già in uso
3. Ridistribuisci (o attendi il prossimo deploy). Da quel momento, aprendo
   `/admin` il browser chiederà utente e password prima di mostrare l'interfaccia.
4. Comunica le credenziali a chi userà `/admin` (es. Elisa) per un canale non
   pubblico (non via email in chiaro se possibile).

Limite di questa protezione: è una password condivisa, uguale per tutti, che non
scade da sola e non lascia un log di chi ha effettivamente avuto accesso.

### 3.2 Cloudflare Access (consigliato, più solido)

Per un controllo migliore (login individuale via email, possibilità di revocare
l'accesso a una persona specifica, log degli accessi), la scelta consigliata è
**Cloudflare Access** (incluso nel piano gratuito di Cloudflare Zero Trust fino a
50 utenti — ben oltre il necessario qui). Non è stato attivato in autonomia perché
richiede configurazione nel dashboard Cloudflare (account, non solo codice):

1. Dashboard Cloudflare → **Zero Trust → Access → Applications → Add an application**.
2. Tipo: **Self-hosted**. Dominio: il sito, percorso `/admin*`.
3. **Policy**: "Allow" per una lista di indirizzi email specifici (es. quello di
   Elisa e il tuo) — chi non è in lista non passa nemmeno la schermata di login.
4. Al primo accesso, la persona autorizzata riceve un codice via email (nessuna
   password da ricordare, nessun account da creare).

Le due protezioni possono coesistere (Access davanti, Basic Auth come ulteriore
barriera) o sostituirsi: se attivi Cloudflare Access, puoi lasciare
`ADMIN_BASIC_AUTH_USER`/`ADMIN_BASIC_AUTH_PASS` vuote.

## 4. Email in ricezione — Cloudflare Email Routing

Per ricevere email su un indirizzo del dominio (es. `info@tuodominio.it`) e
inoltrarle alla casella personale di Elisa, senza gestire un server di posta:

1. Dashboard Cloudflare → dominio → **Email → Email Routing**.
2. Attivare Email Routing: Cloudflare propone automaticamente i record MX da
   aggiungere (li aggiunge da sola se il DNS è gestito da Cloudflare).
3. **Destination address**: la casella email personale di Elisa dove arriveranno gli
   inoltri (richiede una verifica via email di conferma).
4. **Routing rule**: `info@tuodominio.it` (o l'indirizzo scelto) → inoltra alla
   casella personale.

Record DNS coinvolti (Cloudflare li crea automaticamente se il dominio è gestito
lì; se il DNS è altrove, vanno copiati manualmente):

- **MX**: puntano ai server di Cloudflare Email Routing (valori forniti dal
  pannello al momento dell'attivazione)
- **TXT** (verifica dominio per Email Routing): fornito dal pannello

## 5. Email in invio — Brevo

Per inviare email dal dominio (il form di contatto, quando `MAIL_DRIVER=brevo`):

1. Creare un account su [Brevo](https://www.brevo.com) (piano gratuito sufficiente
   per i volumi previsti, <50 richieste/mese).
2. **Senders & IP → Domains**: aggiungere il dominio del sito.
3. Brevo fornisce i record DNS da aggiungere per autenticare il dominio:
   - **SPF** (TXT): autorizza Brevo a inviare per conto del dominio — se esiste già
     un record SPF, va unito con quello esistente, non duplicato.
   - **DKIM** (TXT, di solito 2-3 record): firma crittografica delle email.
   - **DMARC** (TXT, es. `_dmarc.tuodominio.it`): politica su cosa fare delle email
     che falliscono SPF/DKIM — consigliato almeno `p=quarantine` per iniziare.
4. Verificare il dominio dal pannello Brevo (dopo la propagazione DNS, di solito
   pochi minuti con Cloudflare).
5. **SMTP & API → API Keys**: generare una API key.
6. Impostarla su Cloudflare Pages come variabile d'ambiente segreta `BREVO_API_KEY`
   (mai in un file committato).
7. Cambiare `MAIL_DRIVER` da `mock` a `brevo` nelle variabili d'ambiente di
   produzione e ridistribuire (o attendere il prossimo deploy).
8. **Test**: inviare un messaggio di prova dal modulo di contatto pubblicato e
   verificare che arrivi alla casella impostata in `DESTINATARIO_EMAIL`.

## 6. Turnstile (opzionale, non necessario alle stime di traffico attuali)

Se in futuro lo spam sul form diventasse un problema nonostante honeypot/time-trap/
rate-limit:

1. Dashboard Cloudflare → **Turnstile → Add site**, dominio del sito.
2. Copiare **Site key** e **Secret key**.
3. Impostare `TURNSTILE_SECRET_KEY` su Cloudflare Pages.
4. Lato codice: aggiungere il widget Turnstile al form
   (`src/components/ContactForm.astro`) e il campo nascosto
   `cf-turnstile-response` — il codice della Function (`functions/_lib/antispam.ts`,
   funzione `verificaTurnstile`) è già pronto a verificarlo non appena la chiave è
   impostata.

## 7. CMS — GitHub App e Worker OAuth

Vedi `/docs/CMS.md` per la procedura completa e separata.

## 8. Verifica finale post-deploy

- [ ] Il sito pubblico carica su HTTPS con il dominio definitivo
- [ ] `/admin` chiede utente e password (o passa da Cloudflare Access) prima di
      mostrare qualunque cosa — verificare aprendolo in una scheda anonima/privata
- [ ] `/admin` mostra il pulsante di login GitHub (dopo aver completato `/docs/CMS.md`)
- [ ] Il form di contatto arriva davvero alla casella email (dopo il punto 5)
- [ ] `robots.txt` e `sitemap-index.xml` sono raggiungibili e puntano al dominio giusto
- [ ] `dist/_headers` è stato pubblicato (verificare gli header di risposta con gli
      strumenti sviluppatore del browser, scheda Network)
- [ ] `/demo-prenotazione` e `/admin` non compaiono nei risultati di ricerca dopo
      qualche settimana (verifica indicizzazione)

## GitHub Pages (pubblicazione attuale, temporanea)

Il sito si può pubblicare anche su GitHub Pages tramite il workflow
`.github/workflows/deploy-pages.yml`, che parte a ogni push su `main`.

**Una sola volta:** su GitHub → Settings → Pages → "Build and deployment" →
**Source: GitHub Actions**. Con "Deploy from a branch" GitHub prova a costruire il
sito con Jekyll e fallisce (è un progetto Astro).

Differenze rispetto a Cloudflare Pages, da sapere:

- Il sito vive in una sottocartella (`https://<utente>.github.io/DssaCastigliego/`):
  il workflow passa ad Astro `SITE_URL` e `BASE_PATH`, e tutti i link interni usano
  `percorso()` (`src/lib/percorsi.ts`). Con un dominio personalizzato la base torna
  automaticamente `/`.
- **Nessun codice lato server**: il modulo di contatto (`/api/contatto`) non può
  funzionare. Il workflow imposta `PUBLIC_MODULO_CONTATTO=off` e la pagina Contatti
  mostra solo l'invito a scrivere via email.
- **`/admin` non è protetto** (il middleware Basic Auth è una Pages Function). Senza
  la GitHub App collegata il CMS consente solo il lavoro su una copia locale del
  repository, quindi online non permette modifiche, ma la pagina è raggiungibile.
- Il file `_headers` (CSP e header di sicurezza) viene ignorato da GitHub Pages.
