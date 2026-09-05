# Roadmap — dalla demo di prenotazione a un sistema reale

`/demo-prenotazione` è un prototipo puramente front-end (vedi `/docs/REPORT.md` per
cosa fa oggi). Questo documento elenca cosa servirebbe per trasformarlo in una
prenotazione realmente funzionante, e cosa comporterebbe una futura area riservata.
Le stime sono grossolane, pensate per una discussione con Elisa su priorità e costi,
non per un preventivo vincolante.

## Da demo a prenotazione reale

| Componente                                  | Cosa serve                                                                                                                                                                                                                                            | Stima                                                  |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| Backend con stato reale                     | Un servizio che conosca la disponibilità vera (non più calcolata da un file di configurazione) — es. una Cloudflare Pages Function + Cloudflare D1 (database SQL gratuito nel piano free, con limiti) o un calendario esterno come sorgente di verità | 3-6 giorni                                             |
| Hosting a pagamento (eventuale)             | Il piano gratuito di Cloudflare D1/Workers ha limiti di richieste; con traffico oltre le stime attuali (<50 richieste/mese) probabilmente restano nel piano gratuito ancora a lungo, ma va monitorato                                                 | da verificare, probabilmente €0 ancora per molto tempo |
| Notifiche email reali                       | Riuso del driver Brevo già scritto per il form di contatto (`functions/_lib/mail/brevo.ts`), con due email invece di una (conferma al cliente + notifica a Elisa)                                                                                     | 0.5-1 giorno (riusa codice esistente)                  |
| File `.ics` per il calendario               | Generare un allegato `.ics` da includere nell'email di conferma, così l'appuntamento si può aggiungere al calendario del cliente con un clic                                                                                                          | 0.5 giorno                                             |
| Sincronizzazione con il calendario di Elisa | Integrazione con Google Calendar/Outlook via API, per bloccare automaticamente gli slot prenotati e riflettere gli appuntamenti già fissati altrove                                                                                                   | 2-4 giorni (dipende dal provider scelto)               |
| Cancellazione/modifica da parte del cliente | Un link univoco e a scadenza nell'email di conferma per disdire o spostare l'appuntamento, senza bisogno di un account                                                                                                                                | 1-2 giorni                                             |
| Antispam sulla prenotazione reale           | Stesso approccio del form di contatto (honeypot, time-trap, rate limit), eventualmente Turnstile se il volume di abusi lo giustificasse                                                                                                               | 0.5 giorno (riusa `functions/_lib/antispam.ts`)        |
| Test automatici del nuovo flusso            | Copertura equivalente a quella già scritta per il form di contatto (`tests/`)                                                                                                                                                                         | 1-2 giorni                                             |

**Totale indicativo per una prenotazione reale essenziale** (backend + email +
antispam, senza sincronizzazione calendario esterna): **una settimana lavorativa
circa**. La sincronizzazione con calendari esterni e la cancellazione self-service
sono le voci più costose e possono essere aggiunte in un secondo momento.

## Cosa comporterebbe una futura area riservata

Se in futuro Elisa volesse un'area riservata (es. per vedere i propri appuntamenti,
o per dare ai clienti accesso a materiali), questo introdurrebbe requisiti che oggi
il sito evita del tutto per scelta di design (vedi `/docs/DECISIONI.md` e i vincoli
del progetto):

- **Autenticazione**: un sistema di login (email+password o magic link), con
  gestione sicura delle sessioni.
- **Persistenza di dati potenzialmente sensibili**: oggi il sito garantisce "nessuna
  persistenza" come requisito esplicito. Un'area riservata rompe necessariamente
  questa proprietà: andrebbe definito con precisione cosa si conserva.
- **Crittografia a riposo**: qualunque dato personale conservato (specie se
  riconducibile a informazioni sanitarie, anche indirettamente) andrebbe cifrato nel
  database, non solo in transito.
- **Politiche di retention**: per quanto tempo i dati restano conservati, e una
  procedura di cancellazione su richiesta (diritto all'oblio, art. 17 GDPR).
- **Log di accesso**: chi ha visto/modificato cosa e quando, sia per sicurezza sia
  per rispondere a eventuali richieste dell'interessato.
- **DPIA (Valutazione d'Impatto sulla Protezione dei Dati)**: probabilmente
  necessaria data la natura del contesto (studio di psicologia), da valutare con un
  consulente privacy/DPO prima di introdurre qualunque area riservata — non è
  qualcosa che si possa decidere solo a livello tecnico.
- **Hosting**: il piano gratuito di Cloudflare potrebbe non bastare più a seconda
  del volume; andrebbe rivalutato il vincolo "costi ricorrenti zero".

**Non è un passo da affrontare alla leggera**: cambia sostanzialmente il profilo di
rischio e di conformità del sito rispetto a quello attuale, che è stato
deliberatamente progettato per restare il più semplice e privo di dati conservati
possibile.
