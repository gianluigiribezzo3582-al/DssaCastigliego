# Da compilare prima della pubblicazione

Checklist di tutto ciò che è segnaposto nel sito. Niente di quanto segue è stato
inventato: sono tutti valori chiaramente falsi (`{{COSÌ}}`) o dichiarati come bozza,
apposta per non rischiare di pubblicare per errore un dato reale sbagliato.

## Stato attuale

Tutti i segnaposto del sito sono stati compilati e le note di bozza rimosse.
Restano solo queste verifiche e azioni prima/dopo la messa online (guida completa
passo per passo: `/docs/MESSA-ONLINE.md`):

- [ ] Verificare che i numeri di supporto in `/emergenze` siano corretti e attivi
      (Telefono Azzurro 19696, Telefono Amico Italia 02 2327 2327).
- [ ] Immagine per "La mia formazione" (oggi la sezione è solo testo: l'illustrazione
      firmata è stata tolta per mancanza di permesso).
- [ ] Far rileggere privacy e note legali da chi ne ha competenza.
- [ ] Collegare Netlify e il dominio Aruba: `/docs/DEPLOY.md`, sezione Netlify.
- [ ] Configurare Brevo (dominio autenticato su Aruba) e le variabili d'ambiente su
      Netlify, poi provare un invio dal modulo: `/docs/DEPLOY.md`.
- [ ] Impostare `ADMIN_BASIC_AUTH_USER`/`ADMIN_BASIC_AUTH_PASS` su Netlify.
- [ ] Facoltativo: link LinkedIn/Instagram dal CMS (finiscono nei dati strutturati).
