# Da compilare prima della pubblicazione

Checklist di tutto ciò che è segnaposto nel sito. Niente di quanto segue è stato
inventato: sono tutti valori chiaramente falsi (`{{COSÌ}}`) o dichiarati come bozza,
apposta per non rischiare di pubblicare per errore un dato reale sbagliato.

## 1. Dati modificabili dal CMS

Vai su `/admin` → **"Contatti e dati dello studio"** (un solo modulo aggiorna tutto
il sito). File sorgente: `src/content/dati-sito.json`.

Già compilati con i dati reali: email, PEC, località ("San Lazzaro di Savena –
Bologna", l'indirizzo dello studio di proposito non compare), iscrizione all'Ordine
degli Psicologi dell'Emilia-Romagna n. 11846, P. IVA.

- [ ] Telefono e WhatsApp dello studio — **oggi vuoti di proposito** (in attesa di un
      numero dedicato allo studio): finché sono vuoti non compaiono da nessuna parte.
      Dopo averli compilati, **testare il pulsante WhatsApp**.
- [ ] Link LinkedIn / Instagram (facoltativi, oggi vuoti; usati solo nel JSON-LD)
- [ ] Data di aggiornamento dell'informativa privacy (`{{DATA_AGGIORNAMENTO_PRIVACY}}`)
- [ ] Numeri di supporto per la pagina emergenze — **da verificare con attenzione,
      non sono mai stati cercati né inventati** (vedi sezione 4)

## 2. Foto delle tre sezioni della home

- [ ] `src/assets/foto/mi-presento.jpg`
- [ ] `src/assets/foto/di-cosa-mi-occupo.jpg`
- [ ] `src/assets/foto/la-mia-formazione.jpg`
- [ ] Testo alternativo (e, se serve, didascalia) di ciascuna foto dal CMS

Dettagli in `/docs/ASSETS.md`.

## 3. Tempi di risposta

- [ ] Tempi di risposta indicativi alle richieste (`{{TEMPI_RISPOSTA_GIORNI}}` in
      `src/pages/emergenze.astro`)

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

Vedi la checklist completa in `/docs/ASSETS.md` (eventuale immagine Open Graph,
favicon definitiva).

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
