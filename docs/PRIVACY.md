# Privacy — mappa dei dati trattati dal sito

Documento tecnico ad uso di Elisa (o di chi la assiste per gli adempimenti privacy)
per compilare il registro dei trattamenti. Non sostituisce una consulenza legale:
descrive cosa fa davvero il sito, non cosa dichiarare legalmente — quella parte va
scritta o validata da un professionista (vedi anche `/docs/DA-COMPILARE.md`, sezione 7).

## 1. Nessun cookie

Verificato ispezionando la build di produzione (`dist/`): nessuno script del sito
imposta cookie. Il form di contatto non usa cookie di sessione; il rate limiting
lato server si basa sull'IP della richiesta (hashato), non su un cookie del
visitatore. Non c'è quindi bisogno di un banner di consenso cookie.

Le uniche pagine che possono usare **local storage del browser** (non un cookie, dati
che restano solo sul dispositivo di chi naviga, mai inviati al server) sono `/admin`
(Sveltia CMS, per lo stato dell'editor) e potenzialmente `/demo-prenotazione` — nessun
dato personale reale vi transita, essendo entrambe pagine `noindex` fuori dal
percorso pubblico del sito.

## 2. Dati raccolti tramite il modulo di contatto

| Dato                         | Raccolto?                                   | Come                            | Dove finisce                                                                           |
| ---------------------------- | ------------------------------------------- | ------------------------------- | -------------------------------------------------------------------------------------- |
| Nome/identificativo a scelta | Sì, se inserito                             | Campo del form                  | Solo nell'email inviata al titolare                                                    |
| Email                        | Facoltativo (almeno uno tra email/telefono) | Campo del form                  | Solo nell'email inviata al titolare                                                    |
| Telefono                     | Facoltativo (almeno uno tra email/telefono) | Campo del form                  | Solo nell'email inviata al titolare                                                    |
| Preferenza di contatto       | Sì                                          | Campo del form                  | Solo nell'email inviata al titolare                                                    |
| Disponibilità indicativa     | Facoltativo                                 | Campo del form                  | Solo nell'email inviata al titolare                                                    |
| Messaggio libero             | Sì                                          | Campo del form                  | Solo nell'email inviata al titolare                                                    |
| Dati sullo stato di salute   | **No, esplicitamente scoraggiato**          | Il form avvisa di non inserirli | —                                                                                      |
| Indirizzo IP                 | Sì, solo in forma hashata                   | Header della richiesta HTTP     | Solo in memoria temporanea della Function, per il rate limit; MAI insieme al messaggio |

**Nessuno di questi dati viene salvato su un database, un file, o un log
applicativo persistente.** La Cloudflare Pages Function che gestisce l'invio
(`functions/api/contatto.ts`) valida i dati, li inoltra via email tramite Brevo (o li
stampa oscurati in console in modalità di sviluppo `mock`) e non li scrive da nessuna
parte. L'unico posto dove il contenuto del messaggio persiste è la casella email del
titolare, secondo le normali policy di conservazione della sua posta elettronica.

## 3. Fornitori terzi coinvolti (responsabili/sub-responsabili del trattamento)

| Fornitore      | Ruolo                                                                                                              | Cosa tratta                                                                                                                       | Dove (approssimativo)                                                                                               |
| -------------- | ------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **Cloudflare** | Hosting (Cloudflare Pages), esecuzione della Function, instradamento email in ricezione (Cloudflare Email Routing) | Richieste HTTP (incluso IP, per il rate limit e per il funzionamento base del CDN); il traffico del form transita dalla loro rete | Rete globale Cloudflare; verificare le condizioni contrattuali/DPA di Cloudflare per il trasferimento dati extra-UE |
| **Brevo**      | Invio email transazionali (quando `MAIL_DRIVER=brevo`, non attivo di default)                                      | Contenuto del messaggio del form, al momento dell'invio (non conservato dopo)                                                     | Server Brevo (verificare la localizzazione nella loro documentazione/DPA)                                           |

In modalità di sviluppo (`MAIL_DRIVER=mock`, l'impostazione di default in questo
repository) **nessun fornitore terzo viene contattato**: il form funziona ma non
invia nulla realmente.

## 4. WhatsApp

Oggi non attivo: il link compare solo quando nel CMS viene inserito un numero
WhatsApp dello studio (vedi `/docs/DECISIONI.md` §23).

Il pulsante WhatsApp è un link diretto (`wa.me`), non un widget incorporato: non
trasmette alcun dato finché non viene cliccato volontariamente. Una volta aperta la
conversazione, il trattamento è regolato dall'informativa privacy di WhatsApp/Meta,
non da questo sito.

## 5. Conservazione (retention)

- **Messaggi del form di contatto**: non conservati dal sito. Restano solo
  nell'email ricevuta dal titolare (soggetta alle policy della sua casella).
- **Chiavi hashate per il rate limit**: qualche minuto (finestra di 10 minuti,
  poi scartate; vedi `functions/_lib/ratelimit.ts`), e comunque azzerate ad ogni
  riavvio della Function.
- **Contenuti del sito (testi, non dati personali di terzi)**: versionati su Git a
  tempo indeterminato, come qualunque codice sorgente.

## 6. Cosa serve fare a chi si occupa degli adempimenti

- [ ] Verificare/aggiornare il DPA (accordo sul trattamento dati) con Cloudflare e,
      se e quando attivato, con Brevo.
- [ ] Scrivere il registro dei trattamenti usando questa mappa come base.
- [ ] Decidere se è necessario nominare un DPO (probabilmente no per uno studio
      individuale, ma va valutato).
- [ ] Validare legalmente il testo di `/privacy` (oggi una struttura corretta ma con
      segnaposto, vedi `/docs/DA-COMPILARE.md`).
