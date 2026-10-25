# Da compilare prima della pubblicazione

Checklist di tutto ciò che è segnaposto nel sito. Niente di quanto segue è stato
inventato: sono tutti valori chiaramente falsi (`{{COSÌ}}`) o dichiarati come bozza,
apposta per non rischiare di pubblicare per errore un dato reale sbagliato.

## Stato attuale

Tutti i segnaposto del sito sono stati compilati e le note di bozza rimosse.
Restano solo queste verifiche e azioni prima/dopo la messa online:

- [ ] Verificare che i numeri di supporto in `/emergenze` siano corretti e attivi
      (Telefono Azzurro 19696, Telefono Amico Italia 02 2327 2327).
- [ ] Confermare di avere il permesso di pubblicare l'illustrazione di "La mia
      formazione" (opera firmata da un'illustratrice/illustratore) e, se richiesto,
      aggiungere il credito nella didascalia dal CMS.
- [ ] Far rileggere privacy e note legali da chi ne ha competenza.
- [ ] Collegare Netlify e il dominio Aruba: `/docs/DEPLOY.md`, sezione Netlify.
- [ ] Configurare Brevo (dominio autenticato su Aruba) e le variabili d'ambiente su
      Netlify, poi provare un invio dal modulo: `/docs/DEPLOY.md`.
- [ ] Impostare `ADMIN_BASIC_AUTH_USER`/`ADMIN_BASIC_AUTH_PASS` su Netlify.
- [ ] Telefono/WhatsApp dello studio: compilarli dal CMS quando ci saranno.
- [ ] Facoltativo: link LinkedIn/Instagram dal CMS (finiscono nei dati strutturati).
