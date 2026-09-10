# Blocchi — cose che servono da un umano

Elenco di ciò che non è stato possibile completare in autonomia, cosa serviva, cosa è
stato fatto nel frattempo, e cosa resta da fare al mio rientro.

---

## 1. Registrazione GitHub App per l'autenticazione CMS

**Cosa serviva:** un account GitHub con permessi di amministrazione sul repository, per
creare una GitHub App (OAuth) da usare come backend di autenticazione di Sveltia CMS in
produzione.

**Cosa ho fatto nel frattempo:** ho scritto per intero il Worker Cloudflare che gestisce
il flusso OAuth (`worker-oauth/`), pronto per essere collegato non appena la GitHub App
esiste. Ho configurato in parallelo il backend locale di Sveltia CMS (`local_backend: true`
in `public/admin/config.yml`), così su `npm run dev` l'interfaccia `/admin` è pienamente
utilizzabile e scrive/legge i file del repository senza bisogno di credenziali.

**Cosa serve da un umano:** seguire `/docs/CMS.md`, che contiene la procedura passo-passo
per registrare la GitHub App, ottenere `client_id`/`client_secret`, pubblicare il worker
(`wrangler deploy` da `worker-oauth/`) e aggiornare `config.yml` con l'URL del worker.

---

## 2. Chiave API Brevo e invio email reale

**Cosa serviva:** un account Brevo e una API key per inviare davvero le email dal form di
contatto.

**Cosa ho fatto nel frattempo:** il driver `brevo` in `functions/_lib/mail/brevo.ts` è
scritto e testabile (con chiave finta nei test), ma di default il sito gira con
`MAIL_DRIVER=mock`, che stampa solo un riepilogo oscurato in console.

**Cosa serve da un umano:** creare l'account Brevo, verificare il dominio mittente,
generare la API key, impostarla come variabile d'ambiente segreta su Cloudflare Pages
(mai in un file committato) e cambiare `MAIL_DRIVER=brevo`. Procedura in `/docs/DEPLOY.md`.

---

## 3. Cloudflare Turnstile

**Cosa serviva:** un sito Turnstile registrato sul dashboard Cloudflare per ottenere le
chiavi pubblica/segreta.

**Cosa ho fatto nel frattempo:** predisposto il punto di innesto lato Function
(`TURNSTILE_SECRET_KEY` in `.dev.vars.example`, verifica opzionale non attiva in
`functions/api/contatto.ts`) e lato form (attributo dati pronto per il widget, non caricato
alcuno script). L'antispam attivo oggi è honeypot + time-trap + rate limiting per IP.

**Cosa serve da un umano:** registrare il sito su Turnstile, impostare le chiavi, decidere
se e quando attivarlo (probabilmente non necessario sotto le 50 richieste/mese stimate).

---

## 4. Dominio, DNS, Cloudflare Pages, Cloudflare Email Routing

**Cosa serviva:** acquisto del dominio e accesso a un account Cloudflare per configurare
Pages, DNS (MX/SPF/DKIM/DMARC per l'email) e Email Routing.

**Cosa ho fatto nel frattempo:** nessuna azione (esplicitamente vietata). Documentata la
procedura completa passo-passo in `/docs/DEPLOY.md`.

**Cosa serve da un umano:** tutta la sezione "Pubblicazione" di `/docs/DEPLOY.md`.

---

## 5. Rate limiting del form non persistente tra riavvii dell'isolate

**Cosa serviva:** per restare fedeli al vincolo "nessuna persistenza" non è stato aggiunto
un Cloudflare KV per il rate limiting: la mappa dei tentativi vive in memoria del singolo
isolate della Function e si azzera ad ogni riavvio/deploy.

**Perché non è un problema bloccante:** il volume atteso è molto basso (<50 richieste/mese)
e honeypot + time-trap coprono la maggior parte dello spam automatico; il rate limit è una
barriera aggiuntiva, non l'unica.

**Cosa serve da un umano:** se in futuro il volume di spam giustificasse un rate limit
persistente, aggiungere un binding Cloudflare KV (richiede un passaggio nel dashboard,
non fattibile in autonomia) — vedi anche `/docs/ROADMAP.md`.

---

## 6. Numeri di supporto per la pagina emergenze

**Cosa serviva:** numeri di telefono reali di servizi di supporto/emergenza nazionali
italiani.

**Cosa ho fatto nel frattempo:** lasciati segnaposto espliciti (`{{NUMERO_SUPPORTO_1}}`
ecc.) come richiesto esplicitamente dal prompt — non li ho cercati né inventati.

**Cosa serve da un umano:** verificare e inserire i numeri corretti e aggiornati, elencati
anche in `/docs/DA-COMPILARE.md`.

---

## 7. Audit automatico di accessibilità (axe-core/pa11y) e Lighthouse

**Cosa ho fatto nel frattempo:** valutazione manuale del markup rispetto a WCAG 2.2 AA
documentata in `/docs/ACCESSIBILITY.md`, inclusa una tabella di contrasto colore calcolata
numericamente. Non ho eseguito un audit automatico headless (axe-core/pa11y/Lighthouse CI)
in questa sessione: l'ambiente di esecuzione non ha un browser headless preinstallato e
installarne uno (Chromium via Playwright/Puppeteer) avrebbe richiesto un download di
pacchetto binario di sistema non essenziale allo scaffolding. Ho comunque aggiunto
`pa11y` e lo script `npm run a11y` come dipendenza di sviluppo pronta all'uso.

**Cosa serve da un umano:** eseguire `npm run a11y` (scarica Chromium alla prima
esecuzione) e `npx unlighthouse --site http://localhost:4321` dopo `npm run preview`,
poi riportare i punteggi reali.

---

## 8. Protezione di `/admin` non ancora attiva

**Cosa serviva:** impedire a chiunque indovini l'indirizzo di aprire `/admin`.

**Cosa ho fatto nel frattempo:** scritto per intero `functions/_middleware.ts`,
che blocca `/admin` (e ogni sotto-percorso) con Basic Auth non appena sono
impostate le variabili d'ambiente `ADMIN_BASIC_AUTH_USER`/`ADMIN_BASIC_AUTH_PASS`
— testato dal vivo con Wrangler, funziona correttamente (401 senza credenziali o
con credenziali sbagliate, 200 con quelle giuste; le pagine pubbliche non sono
toccate). Finché quelle due variabili non sono impostate (repository appena
clonato, sviluppo locale), `/admin` resta aperto come prima: non ho impostato
alcuna password io stesso, perché sceglierla spetta a voi.

**Cosa serve da un umano:** impostare `ADMIN_BASIC_AUTH_USER`/`ADMIN_BASIC_AUTH_PASS`
come secret su Cloudflare Pages prima di considerare il sito pubblicato — procedura
in `/docs/DEPLOY.md`, sezione 3. Consigliata anche l'attivazione di Cloudflare
Access per una protezione più solida (richiede il dashboard Cloudflare, non
attivabile in autonomia).

---

_Le voci successive vengono aggiunte in fondo a questo file man mano che emergono._
