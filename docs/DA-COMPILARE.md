# Da compilare prima della pubblicazione

Checklist di tutto ciò che è segnaposto nel sito. Niente di quanto segue è stato
inventato: sono tutti valori chiaramente falsi (`{{COSÌ}}`) o dichiarati come bozza,
apposta per non rischiare di pubblicare per errore un dato reale sbagliato.

## 1. Dati modificabili dal CMS

Vai su `/admin` → **"Contatti e dati dello studio"** (un solo modulo aggiorna tutto
il sito). File sorgente: `src/content/dati-sito.json`.

- [ ] Email di contatto (`{{EMAIL_CONTATTO}}`)
- [ ] Telefono di contatto (`{{TELEFONO_CONTATTO}}`)
- [ ] Numero WhatsApp, solo cifre in formato internazionale (`{{WHATSAPP_NUMERO}}`) —
      **testare il pulsante WhatsApp dopo la compilazione**
- [ ] Link LinkedIn (`{{URL_LINKEDIN}}`)
- [ ] Link Instagram (`{{URL_INSTAGRAM}}`)
- [ ] Via e numero civico dello studio (`{{INDIRIZZO_STUDIO_VIA}}`)
- [ ] CAP dello studio (`{{INDIRIZZO_STUDIO_CAP}}`)
- [ ] Orario di apertura/chiusura (`{{ORARIO_APERTURA}}`, `{{ORARIO_CHIUSURA}}`)
- [ ] Regione e numero di iscrizione all'Albo (`{{ALBO_REGIONE}}`, `{{ALBO_NUMERO}}`)
- [ ] Partita IVA (`{{PARTITA_IVA}}`)
- [ ] Codice fiscale (`{{CODICE_FISCALE}}`)
- [ ] Data di aggiornamento dell'informativa privacy (`{{DATA_AGGIORNAMENTO_PRIVACY}}`)
- [ ] Numeri di supporto per la pagina emergenze — **da verificare con attenzione,
      non sono mai stati cercati né inventati in questa sessione** (vedi sezione 4)

## 2. Testi biografici e professionali (pagina "Chi sono")

`/admin` → **Pagine del sito → Chi sono**, oppure `src/content/pagine/chi-sono.md`.

- [ ] Corso di laurea (`{{CORSO_DI_LAUREA}}`) e Ateneo (`{{ATENEO}}`)
- [ ] Formazione post-laurea (`{{FORMAZIONE_POST_LAUREA}}`)
- [ ] Titoli di studio elencati (`{{TITOLO_DI_STUDIO_1}}`, `{{TITOLO_DI_STUDIO_2}}`)
- [ ] Formazione continua (`{{FORMAZIONE_CONTINUA}}`)
- [ ] L'intero testo della biografia e dell'approccio, oggi generico e di bozza

## 3. Durata, frequenza e tempi di risposta

- [ ] Durata di una seduta in minuti (`{{DURATA_SEDUTA_MINUTI}}`) — compare in
      `src/content/pagine/come-lavoro.md` e `src/content/faq/durata-frequenza.md`
- [ ] Tempi di risposta indicativi alle richieste (`{{TEMPI_RISPOSTA_GIORNI}}` in
      `src/pages/emergenze.astro`)
- [ ] Informazioni sui costi (oggi la pagina FAQ dice esplicitamente che il costo
      viene comunicato al primo contatto: decidere se mantenere questa scelta o
      pubblicare una tariffa, vedi `src/content/faq/costi.md`)

## 4. Numeri di emergenza (delicato — verificare con cura)

`src/pages/emergenze.astro` e `dati-sito.json` (`emergenze.numeriSupporto`):
attualmente contengono `{{NOME_SERVIZIO_SUPPORTO_1}}` / `{{NUMERO_SUPPORTO_1}}` e la
coppia `_2`. Vanno sostituiti con numeri reali e verificati (es. servizi nazionali di
ascolto), controllando che siano ancora attivi al momento della pubblicazione. Non
sono stati cercati né inventati in autonomia per non rischiare di pubblicare un
numero sbagliato in un contesto delicato — vedi `/docs/BLOCCHI.md`.

## 5. Dominio (va aggiornato in TRE punti)

Oggi il sito usa ovunque il dominio segnaposto
`https://www.esempio-elisa-castigliego.it`. Quando il dominio reale è stato
acquistato, aggiornarlo in:

- [ ] `astro.config.mjs` (costante `DOMINIO_SEGNAPOSTO`, usata per canonical/sitemap)
- [ ] `src/config/site.ts` (campo `dominio`, usato nel JSON-LD)
- [ ] `public/robots.txt` (riga `Sitemap:`)

## 6. Fotografia e altri asset visivi

Vedi la checklist completa in `/docs/ASSETS.md` (fotografia definitiva di Elisa,
eventuale immagine Open Graph, illustrazioni).

## 7. Pagine legali

`/privacy`, `/cookie-policy`, `/note-legali` contengono una struttura con sezioni già
scritte ma segnaposto/bozze dove serve una verifica legale specifica:

- [ ] `{{DPO_NOME}}` in `src/pages/privacy.astro`, se viene nominato un DPO
- [ ] Revisione complessiva del testo di `/privacy` e `/note-legali` da parte di chi
      di competenza — il testo attuale è corretto nella struttura ma generico
- [ ] Numero di versione dell'informativa privacy, oggi `0.1-bozza`

## 8. CMS e deploy

- [ ] Registrare la GitHub App e collegare il Worker OAuth — procedura in `/docs/CMS.md`
- [ ] Configurare dominio, DNS, Cloudflare Pages, email — procedura in `/docs/DEPLOY.md`
- [ ] Decidere se e quando passare `MAIL_DRIVER` da `mock` a `brevo` — vedi README e `/docs/DEPLOY.md`
