# Messa online — guida passo per passo

Sito: **https://www.elisacastigliegopsicologa.it**
Hosting: **Netlify** · Dominio: **Aruba** · Email del modulo: **Brevo** · Repository:
`gianluigiribezzo3582-al/DssaCastigliego`, branch `main`.

Il codice è già pronto: ogni passaggio qui sotto è una configurazione da fare nei
pannelli dei servizi. Segui l'ordine: alcuni passaggi dipendono dai precedenti.
Tempo indicativo: 1-2 ore di lavoro, più l'attesa della propagazione DNS (da pochi
minuti a qualche ora, raramente fino a 24-48 ore).

---

## 0. Prima di tutto: contenuti (con Elisa)

- [ ] **Immagine di "La mia formazione"**: l'illustrazione firmata è stata tolta
      (manca il permesso dell'autrice). Oggi la sezione è solo testo. Se trovate
      un'immagine utilizzabile (foto vostra, opera di pubblico dominio o con licenza
      libera, illustrazione commissionata), caricala come
      `src/assets/foto/la-mia-formazione.jpg`.
- [ ] **Numeri in `/emergenze`**: verifica che Telefono Azzurro (19696) e Telefono
      Amico Italia (02 2327 2327) siano corretti e attivi.
- [ ] **Privacy e note legali**: falle rileggere a chi se ne occupa. Valutate insieme
      se le note legali debbano indicare l'indirizzo dello studio (il D.Lgs. 70/2003
      chiede il "domicilio o sede" a chi offre servizi online; oggi c'è solo la
      località).

---

## 1. Netlify: collega il repository (≈ 10 minuti)

1. Vai su **app.netlify.com** e accedi con **GitHub** (account
   `gianluigiribezzo3582-al`).
2. **Add new site → Import an existing project → Deploy with GitHub**.
3. Autorizza l'app Netlify su GitHub e scegli il repository **DssaCastigliego**.
4. Branch: **main**. Le impostazioni di build vengono lette da `netlify.toml`: non
   cambiare nulla e premi **Deploy**.
5. Dopo un paio di minuti il sito è online su un indirizzo provvisorio
   `qualcosa.netlify.app`. Rinominalo: **Site configuration → Site details → Change
   site name** → `elisacastigliegopsicologa`. L'indirizzo diventa
   **elisacastigliegopsicologa.netlify.app**: ti serve al passo 3.
6. Apri l'indirizzo e controlla che il sito si veda bene.

## 2. Netlify: password per `/admin` (≈ 5 minuti)

**Site configuration → Environment variables → Add a variable** (lascia "All
scopes" e "Same value for all deploy contexts"):

| Chiave                  | Valore                                                 |
| ----------------------- | ------------------------------------------------------ |
| `ADMIN_BASIC_AUTH_USER` | un nome utente a scelta                                |
| `ADMIN_BASIC_AUTH_PASS` | una password robusta (spunta "Contains secret values") |

Poi **Deploys → Trigger deploy → Deploy site**. Prova ad aprire
`…netlify.app/admin`: deve chiedere nome utente e password.

## 3. Collega il dominio (Netlify + Aruba) (≈ 20 minuti + attesa)

### 3a. Su Netlify

1. **Domain management → Add a domain** → scrivi `www.elisacastigliegopsicologa.it`
   → **Verify** → **Add domain**. Se Netlify chiede se aggiungere anche il dominio
   senza `www`, conferma.
2. Controlla che **www.elisacastigliegopsicologa.it** sia il **Primary domain**: il
   dominio senza `www` reindirizzerà da solo lì.
3. Netlify mostrerà "Awaiting External DNS": è normale, ora tocca ad Aruba.

### 3b. Su Aruba

1. Entra nell'**Area Clienti Aruba** → seleziona il dominio
   **elisacastigliegopsicologa.it** → **Pannello di controllo** → sezione **Gestione
   DNS** (il nome esatto può essere "Gestione DNS e record" o simile).
2. **Elimina** i record già presenti per il dominio principale e per `www` che
   puntano ad Aruba (di solito record **A** su `@`/vuoto e su `www`, e record
   **AAAA** se ci sono). **Non toccare** i record **MX** né quelli legati alla posta.
3. **Aggiungi**:

| Tipo  | Nome / Host                      | Valore                                  |
| ----- | -------------------------------- | --------------------------------------- |
| A     | `@` (o vuoto: il dominio stesso) | `75.2.60.5`                             |
| CNAME | `www`                            | `elisacastigliegopsicologa.netlify.app` |

L'indirizzo `75.2.60.5` è quello che Netlify indica per i domini senza `www`:
**verifica che coincida con quello mostrato nel pannello Netlify** (Domain
management → "Pending DNS verification" → istruzioni) e, in caso di differenza,
usa quello di Netlify. 4. Salva. Su Aruba i nomi host si scrivono di solito **senza** il dominio finale
(es. `www`, non `www.elisacastigliegopsicologa.it`).

### 3c. Attesa e HTTPS

- Torna su Netlify → Domain management: quando i DNS sono propagati compare il
  dominio verificato. Netlify genera da solo il certificato **HTTPS** (Let's
  Encrypt) — se dopo qualche ora non è partito, premi **Verify DNS configuration**
  e poi **Provision certificate** nella sezione HTTPS.
- Controlla che `http://elisacastigliegopsicologa.it` porti a
  `https://www.elisacastigliegopsicologa.it`.

## 4. Brevo: invio delle email del modulo (≈ 30 minuti + attesa)

Finché questo passo non è fatto, nella pagina Contatti c'è il riquadro "Scrivimi via
email" al posto del modulo: il sito è comunque pubblicabile.

1. Crea un account gratuito su **brevo.com**.
2. **Senders, Domains & Dedicated IPs → Domains → Add a domain** →
   `elisacastigliegopsicologa.it` → scegli l'autenticazione manuale ("Authenticate
   the domain yourself").
3. Brevo mostra alcuni record DNS (di solito: un **TXT** `brevo-code:…`, due **CNAME**
   `brevo1._domainkey` e `brevo2._domainkey`, un **TXT** `_dmarc`). Inseriscili su
   Aruba, nella stessa Gestione DNS del passo 3b, **copiandoli esattamente**. Nel
   campo nome host metti solo la parte prima del dominio (es. `brevo1._domainkey`).
   Se su Aruba esiste già un record TXT `_dmarc` o un record SPF (`v=spf1 …`), non
   crearne un secondo: modifica quello esistente.
4. Su Brevo premi **Authenticate**/**Verify** (può servire attendere la propagazione).
5. **Senders → Add a sender**: nome `Sito Dott.ssa Elisa Castigliego`, email
   `sito@elisacastigliegopsicologa.it` (la casella non deve esistere davvero: basta
   il dominio autenticato).
6. **SMTP & API → API Keys → Generate a new API key**: accesso **Limitato**, con
   **Email transazionali: Tutti** e tutto il resto su **Nessuna**. Copia la chiave
   (inizia con `xkeysib-`, si vede una sola volta). Brevo fa scadere le chiavi
   dopo 90 giorni di inutilizzo: per evitarlo il sito ha una funzione pianificata
   (`netlify/functions/brevo-keepalive.ts`) che ogni settimana fa una richiesta di
   sola lettura, senza inviare email. Esito in Netlify → Logs → Functions →
   brevo-keepalive.
   **Importante:** in Brevo → menu del profilo → **Security → Authorised IPs**
   disattiva il blocco degli IP sconosciuti ("Deactivate blocking"). Le funzioni di
   Netlify inviano da indirizzi sempre diversi: con il blocco attivo Brevo rifiuta
   ogni invio (errore 401 nei log della function).
   Anche con il blocco disattivato, al **primo invio** Brevo può mandare
   all'email dell'account un messaggio **"Verifica un nuovo IP"** (IP di Amazon/USA:
   sono i server di Netlify). Va scelto **"Interrompi controllo degli indirizzi IP"**:
   non "autorizza il nuovo IP" (Netlify cambia IP quasi a ogni invio) e non
   "cambia chiavi API" (invaliderebbe la chiave appena configurata).
7. Su **Netlify → Environment variables** aggiungi:

| Chiave                 | Valore                                                                    |
| ---------------------- | ------------------------------------------------------------------------- |
| `MAIL_DRIVER`          | `brevo`                                                                   |
| `BREVO_API_KEY`        | la chiave appena generata (spunta "Contains secret values")               |
| `BREVO_MITTENTE_EMAIL` | `sito@elisacastigliegopsicologa.it`                                       |
| `BREVO_MITTENTE_NOME`  | `Sito Dott.ssa Elisa Castigliego`                                         |
| `DESTINATARIO_EMAIL`   | `castigliego.elisa@yahoo.com`                                             |
| `RATE_LIMIT_SALT`      | una stringa casuale lunga (es. 40 caratteri da un generatore di password) |

8. **Deploys → Trigger deploy → Clear cache and deploy site**. Nella pagina Contatti
   ora compare il modulo.
9. **Prova**: invia un messaggio dal sito, verifica che arrivi su Yahoo (controlla
   anche lo spam la prima volta) e che rispondendo la risposta vada a chi ha scritto.

## 5. Controlli finali (≈ 15 minuti)

- [ ] `https://www.elisacastigliegopsicologa.it` si apre con il lucchetto.
- [ ] Foto, testi e link del footer sono corretti, anche da telefono.
- [ ] `/admin` chiede la password.
- [ ] Il modulo invia davvero (passo 4.9).
- [ ] `https://www.elisacastigliegopsicologa.it/robots.txt` e
      `/sitemap-index.xml` si aprono.
- [ ] Anteprima social: incolla il link del sito in WhatsApp e controlla che compaia
      il logo con il titolo.
- [ ] Dati strutturati: https://search.google.com/test/rich-results con l'indirizzo
      del sito (deve riconoscere "Psychologist" senza errori).

## 6. Motori di ricerca (≈ 15 minuti)

1. **Google Search Console** (search.google.com/search-console) → **Aggiungi
   proprietà → Dominio** → `elisacastigliegopsicologa.it`. Google dà un record **TXT**
   da aggiungere su Aruba (nome host `@`/vuoto). Dopo la verifica: **Sitemap** →
   `https://www.elisacastigliegopsicologa.it/sitemap-index.xml` → Invia.
2. **Bing Webmaster Tools** (bing.com/webmasters) → **Importa da Google Search
   Console**: un clic.
3. Facoltativo ma utile: profilo **Google Business** come psicologa a San Lazzaro di
   Savena (si può scegliere di non mostrare l'indirizzo esatto).

## 7. Pulizia

- [ ] **GitHub → repository → Settings → Pages → Unpublish site** (o Source: None):
      la copia di anteprima su `github.io` non serve più. È già marcata `noindex`,
      quindi non è urgente.

---

## Più avanti (facoltativo)

- **Telefono/WhatsApp dello studio**: quando ci sarà il numero, compilalo da `/admin`
  → "Contatti e dati dello studio" (oppure in `src/content/dati-sito.json`).
- **Modifiche da `/admin` direttamente online**: dopo la password della pagina,
  Sveltia chiede "Accedi con GitHub". Per attivarlo: GitHub OAuth App + provider
  OAuth su Netlify, circa 10 minuti, procedura in `/docs/CMS.md` ("Login con
  GitHub tramite Netlify"). Chi salva deve avere un account GitHub con accesso
  alla repository.

## Se qualcosa non va

- **Build fallita con "Secrets scanning found secrets in build"**: Netlify ha
  trovato nei file del sito il valore di una variabile d'ambiente. Le variabili non
  segrete (nome utente di `/admin`, `MAIL_DRIVER`, mittente e destinatario
  dell'email) sono già escluse in `netlify.toml`. Se l'errore indica
  `ADMIN_BASIC_AUTH_PASS`, `BREVO_API_KEY` o `RATE_LIMIT_SALT`, il valore scelto
  compare nel sito (es. una password che è una parola presente nei testi):
  **cambialo** con uno casuale, non disattivare il controllo.

- **Il dominio non si apre dopo molte ore**: controlla su Aruba che non siano
  rimasti vecchi record A/AAAA per `@` o `www`, e che il CNAME punti esattamente a
  `elisacastigliegopsicologa.netlify.app`.
- **Il modulo non compare**: mancano `MAIL_DRIVER=brevo` o `BREVO_API_KEY` su Netlify,
  oppure non è stato rifatto il deploy dopo averle aggiunte.
- **Il modulo dà errore all'invio**: Netlify → **Logs → Functions → contatto** mostra
  il motivo (di solito il dominio non ancora autenticato su Brevo o il mittente
  sbagliato).
