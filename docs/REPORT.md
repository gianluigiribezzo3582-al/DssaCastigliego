# Report finale — sessione autonoma

Sessione di scaffolding autonomo completata su tutte e 10 le fasi del piano di
esecuzione. Nessuna fase è stata bloccata; ogni blocco incontrato riguardava solo
singoli passaggi (mai un'intera fase) ed è annotato in `/docs/BLOCCHI.md` insieme a
cosa fare per sbloccarlo.

## Come avviare il progetto

```bash
npm install
npm run dev
```

Il sito è su `http://localhost:4321`, il CMS su `http://localhost:4321/admin`
(funzionante da subito con il backend locale, nessuna credenziale richiesta — clic su
"Lavora con la repository locale"). Verificato con una clonazione pulita del
repository: `npm install && npm run dev` funziona da zero.

Per testare anche il form di contatto tramite la vera Pages Function:
`npm run dev:functions` (compila e avvia via Wrangler).

## Cosa è stato fatto

- **Sito completo**, tutte le rotte previste dal brief: home, chi sono, aree di
  intervento (indice + 6 schede), come lavoro, FAQ, contatti, emergenze, privacy,
  cookie policy, note legali, più una 404 personalizzata.
- **Design system** (Direzione A "Terracotta calda") implementato per intero, con le
  Direzioni B e C documentate e commutabili cambiando un solo file
  (`src/styles/tokens.css`). Tipografia self-hosted (Fraunces + Work Sans, licenza
  OFL, via pacchetti npm, nessun Google Fonts).
- **Content collections** (Astro, validate con Zod) per aree, FAQ e pagine, tutte
  gestibili dal CMS.
- **Form di contatto** completo: accessibile, funzionante senza JavaScript,
  honeypot + time-trap + rate-limit, Pages Function con driver `mock`/`brevo`
  (di default `mock`, nessun invio reale né persistenza), avviso esplicito a non
  inserire dati sanitari.
- **CMS**: Sveltia CMS su `/admin`, backend locale funzionante subito, collezioni con
  etichette in italiano per un pubblico non tecnico, Worker OAuth GitHub scritto per
  intero ma non collegato (richiede una GitHub App, non creabile in autonomia).
- **SEO**: title/description per pagina, sitemap, robots.txt, JSON-LD (Psychologist,
  FAQPage, BreadcrumbList), canonical, `noindex` su `/admin` e `/demo-prenotazione`.
- **Sicurezza**: `_headers` generato automaticamente in build con una Content-Security-Policy
  basata su hash SHA-256 degli script inline (nessun `unsafe-inline`, nessuna terza
  parte), più gli header di sicurezza standard.
- **Demo di prenotazione** (`/demo-prenotazione`) completa e navigabile: calendario
  con slot deterministici (stabili tra i refresh), flusso giorno → orario → dati →
  riepilogo → conferma con anteprima delle due email, banner "dimostrazione" fisso,
  nessuna chiamata di rete, testata manualmente end-to-end in un browser reale.
- **Accessibilità**: verifica manuale completa contro WCAG 2.2 AA (contrasto colore
  calcolato numericamente, struttura semantica, tastiera, focus, `prefers-reduced-motion`,
  target di tocco) — dettagli in `/docs/ACCESSIBILITY.md`.
- **Test automatici** (Vitest, 57 test): validazione del form, antispam, rate limit,
  la function completa (incluso "nessuna chiamata di rete in modalità mock"), content
  collections (via build Astro + Zod), link checker interno, verifica della CSP
  generata.
- **CI**: workflow GitHub Actions (`.github/workflows/ci.yml`) — install, lint,
  type-check, build, test. Non pubblica nulla.
- **Documentazione completa** in `/docs`: decisioni, blocchi, checklist dei
  segnaposto da compilare, guida non tecnica per Elisa, procedure di deploy/CMS,
  mappa privacy, roadmap.

## Cosa manca (e perché, di proposito)

Tutto ciò che richiedeva account esterni, credenziali reali o azioni con
conseguenze fuori dal repository è stato **scritto ma non attivato**, come da
istruzioni: GitHub App/OAuth per il CMS, chiave Brevo, dominio/DNS/Cloudflare Pages,
Turnstile. Elenco completo con procedura in `/docs/BLOCCHI.md` e `/docs/DEPLOY.md`.

Non è stato eseguito un audit automatico di accessibilità/performance
(axe-core/pa11y/Lighthouse): l'ambiente non aveva un browser headless pronto.
Lo script `npm run a11y` è pronto per essere eseguito.

## Cosa devo verificare io (checklist rapida)

1. Leggere `/docs/DA-COMPILARE.md` e sostituire tutti i segnaposto (`{{COSÌ}}`) con i
   dati veri: contatti, indirizzo, Albo, P.IVA, numeri di emergenza (questi ultimi
   **non** sono stati cercati né inventati, vanno verificati con cura).
2. Rivedere tutti i testi marcati `[BOZZA]`: sono scritti per essere plausibili e
   rispettosi delle norme deontologiche, ma restano segnaposto da riscrivere con i
   contenuti reali.
3. Guardare `/demo-prenotazione` e `/admin` in locale (`npm run dev`) prima di
   qualunque altra cosa — sono le parti "vive" da mostrare o provare per prime.
4. Scegliere una delle tre direzioni di design in `/docs/DESIGN.md` (oggi è attiva la
   A) o confermarla.
5. Seguire `/docs/CMS.md` e `/docs/DEPLOY.md` quando si è pronti a pubblicare
   davvero.

## Le tre cose da rivedere per prime, secondo me

1. **I testi placeholder delle pagine "Chi sono" e delle aree di intervento.** Sono
   la parte più "a vista" e quella che richiede più lavoro umano (biografia,
   formazione, tono di voce): tutto il resto del sito è già pronto a riceverli senza
   bisogno di altre modifiche tecniche.
2. **I numeri di emergenza in `/emergenze`.** Sono l'unico punto del sito dove un
   segnaposto sbagliato o dimenticato avrebbe conseguenze delicate: vanno verificati
   con priorità più alta di qualunque altro segnaposto.
3. **La decisione su GitHub App/CMS in produzione.** È il pezzo di infrastruttura più
   lungo da completare (richiede creare account, seguire una procedura a più passi)
   ed è sul percorso critico per permettere a Elisa di modificare il sito da sola:
   conviene affrontarlo presto, anche se il resto del sito è già pubblicabile senza.
