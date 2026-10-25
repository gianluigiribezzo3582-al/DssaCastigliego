# Guida per modificare il sito (senza saper programmare)

Questa guida spiega come modificare i testi del sito e pubblicare le modifiche,
usando solo il browser.

Questa stessa guida è raggiungibile in ogni momento con un clic dal bottone
**"Guida all'utilizzo"**, sempre visibile in basso a destra nella schermata `/admin`.

## Come si apre l'area di modifica

Vai su `/admin` del sito (es. `www.tuo-dominio.it/admin`) e accedi con il pulsante di
login. Se questa parte non è ancora stata attivata dallo sviluppatore, vedi la nota in
fondo a questa guida.

Ti troverai davanti a un elenco di sezioni sulla sinistra:

- **Pagine del sito** — titolo e sottotitolo in cima alla home, e i testi per Google
- **Sezioni della home** — Mi presento, Di cosa mi occupo, La mia formazione
- **Contatti e dati dello studio** — email, PEC, località, iscrizione all'Ordine, P. IVA
- **Colori del sito** — la palette di tutto il sito

## Modificare un testo esistente

1. Clicca sulla sezione (es. "Sezioni della home").
2. Clicca sulla voce che vuoi modificare (es. "Mi presento").
3. Modifica il testo nei campi. I campi con un asterisco o segnati come obbligatori
   vanno sempre compilati. Per andare a capo con un nuovo paragrafo lascia una riga
   vuota.
4. In alto a destra, clicca **"Salva"** (o "Save").
5. Il sito impiega di solito qualche minuto a ricostruirsi da solo con le modifiche:
   se non le vedi subito online, aspetta un paio di minuti e ricarica la pagina.

Non serve toccare nulla che assomigli a codice (parentesi graffe, simboli strani):
se vedi un testo tra doppie graffe come `{{NUMERO_SUPPORTO_1}}`, è un segnaposto che
aspetta ancora il dato vero — sostituiscilo con il valore corretto, senza lasciare
le graffe.

## Le foto delle tre sezioni

Le foto **non** si cambiano dal pannello `/admin`: sono file nella cartella
`src/assets/foto/` del repository, e il nome del file decide in quale sezione
compaiono:

| Sezione           | Nome del file           |
| ----------------- | ----------------------- |
| Mi presento       | `mi-presento.jpg`       |
| Di cosa mi occupo | `di-cosa-mi-occupo.jpg` |
| La mia formazione | `la-mia-formazione.jpg` |

Vanno bene anche `.jpeg`, `.png` o `.webp`. Per sostituire una foto basta caricare un
nuovo file con lo stesso nome. Se un file manca, al suo posto compare un riquadro
"Foto in arrivo". Le foto vengono ritagliate in verticale (proporzioni 4:5): meglio
che il soggetto sia centrato.

Dal pannello, in ogni sezione, puoi invece compilare:

- **Descrizione della foto per chi non vede**: una frase letta dai lettori di schermo
  (es. "Ritratto della dott.ssa Elisa Castigliego"). Lasciala vuota se la foto è solo
  decorativa.
- **Didascalia sotto la foto**: facoltativa, ad esempio titolo e autore di un'opera
  d'arte.

## Modificare email, PEC, telefono, località, dati dell'Ordine

Vai su **"Contatti e dati dello studio"**. Qui trovi tutti i dati che compaiono nel
resto del sito (footer, pagina contatti, note legali). Modificando un valore qui, si
aggiorna automaticamente ovunque compaia — non serve cercarlo pagina per pagina.

**Telefono e WhatsApp** sono oggi vuoti di proposito: finché restano vuoti non
compaiono da nessuna parte. Quando avrai il numero dello studio, basta compilarli e
salvare. Il numero di WhatsApp va inserito solo con le cifre, senza il "+" e senza
spazi (es. per l'Italia: `39` seguito dal numero di cellulare).

## Cambiare i colori del sito

Vai su **"Colori del sito"**. Ogni voce ha un quadratino colorato (cliccalo per
scegliere il colore) e accanto il codice del colore (es. `#ac4c2b`), che puoi anche
scrivere a mano. Sotto ogni voce trovi dove viene usato quel colore e il valore
**originale**: per tornare indietro basta riscrivere quel codice.

- **Sfondo delle pagine** e **Sfondo delle sezioni alternate** devono restare chiari.
- **Testo principale**, **Testo secondario**, **Colore principale** e **Colore delle
  etichette** devono restare abbastanza scuri da leggersi bene sugli sfondi.

Il sito controlla da solo la leggibilità (secondo le regole di accessibilità WCAG):
se un colore scelto non si legge abbastanza bene, per quella voce usa
automaticamente il colore originale. Quindi, se dopo aver salvato un colore non
cambia, probabilmente era troppo chiaro (o lo sfondo troppo scuro): prova una
tonalità più decisa. Il colore del testo dei pulsanti (bianco o scuro) viene scelto
da solo. Le fotografie di sfondo decorative non cambiano colore.

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
