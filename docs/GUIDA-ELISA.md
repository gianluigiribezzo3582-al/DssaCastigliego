# Guida per modificare il sito (senza saper programmare)

Questa guida spiega come modificare i testi del sito, aggiungere una domanda alla
pagina FAQ e pubblicare le modifiche, usando solo il browser.

Questa stessa guida è raggiungibile in ogni momento con un clic dal bottone
**"Guida per Elisa"**, sempre visibile in basso a destra nella schermata `/admin`.

## Come si apre l'area di modifica

Vai su `/admin` del sito (es. `www.tuo-dominio.it/admin`) e accedi con il pulsante di
login. Se questa parte non è ancora stata attivata dallo sviluppatore, vedi la nota in
fondo a questa guida.

Ti troverai davanti a un elenco di sezioni sulla sinistra:

- **Pagine del sito** — Home, Chi sono, Come lavoro
- **Aree di intervento** — le schede tipo "Ansia", "Relazioni", ecc.
- **Domande frequenti** — le voci della pagina FAQ
- **Contatti e dati dello studio** — email, telefono, WhatsApp, indirizzo, orari

## Modificare un testo esistente

1. Clicca sulla sezione (es. "Pagine del sito").
2. Clicca sulla voce che vuoi modificare (es. "Chi sono").
3. Modifica il testo nei campi. I campi con un asterisco o segnati come obbligatori
   vanno sempre compilati.
4. In alto a destra, clicca **"Salva"** (o "Save").
5. Il sito impiega di solito qualche minuto a ricomprarsi da solo con le modifiche:
   se non le vedi subito online, aspetta un paio di minuti e ricarica la pagina.

Non serve toccare nulla che assomigli a codice (parentesi graffe, simboli strani):
se vedi un testo tra doppie graffe come `{{ALBO_NUMERO}}`, è un segnaposto che
aspetta ancora il dato vero — sostituiscilo con il valore corretto, senza lasciare
le graffe.

## Aggiungere una nuova domanda alla pagina FAQ

1. Vai su **"Domande frequenti"**.
2. Clicca **"Nuovo/a Domande frequenti"** (o il pulsante "+").
3. Compila:
   - **Domanda**: la domanda così come la scriveresti tu.
   - **Ordine di visualizzazione**: un numero. Le domande con numero più basso
     compaiono più in alto nella pagina (es. metti "9" se vuoi che sia una delle
     ultime).
   - **Risposta**: il testo della risposta.
4. Clicca **"Salva"**.

Per cambiare l'ordine delle domande esistenti, apri ciascuna e modifica il numero in
"Ordine di visualizzazione".

## Aggiungere una nuova area di intervento

Stesso procedimento, nella sezione **"Aree di intervento"**: Titolo, Riassunto breve
(quello che si vede nelle anteprime), Ordine, e il testo completo della scheda.

## Modificare email, telefono, WhatsApp, indirizzo, orari

Vai su **"Contatti e dati dello studio"**. Qui trovi tutti i dati che compaiono nel
resto del sito (footer, pagina contatti, pagina emergenze, dati dell'Albo). Modificando
un valore qui, si aggiorna automaticamente ovunque compaia nel sito — non serve
cercarlo pagina per pagina.

Il numero di WhatsApp va inserito solo con le cifre, senza il "+" e senza spazi
(es. per l'Italia: `39` seguito dal numero di cellulare senza lo 0 iniziale).

## Pubblicare le modifiche

Con Sveltia CMS, cliccare "Salva" equivale a pubblicare: non c'è un passaggio
separato di "pubblicazione" da ricordare. Ogni salvataggio genera automaticamente
una nuova versione del sito.

## Se qualcosa va storto

- Se hai salvato un errore e vuoi tornare indietro, apri di nuovo la stessa voce e
  correggi il testo, poi salva di nuovo: non c'è bisogno di procedure speciali.
- Se il sito online non si aggiorna dopo qualche minuto, prova a ricaricare la pagina
  con Ctrl+Maiusc+R (o Cmd+Maiusc+R su Mac): a volte il browser mostra una versione
  salvata in memoria.
- Se `/admin` non si apre o non compare il pulsante di login, il login con GitHub
  potrebbe non essere ancora stato attivato dallo sviluppatore (vedi `/docs/CMS.md`):
  scrivigli per completare quel passaggio.

## Nota tecnica per lo sviluppatore che segue dopo di me

Il login "vero" (da qualunque computer, senza dover selezionare la cartella del
progetto) richiede la creazione di una GitHub App, non fattibile in autonomia in
questa sessione. Il codice è pronto: la procedura di collegamento è in `/docs/CMS.md`.
