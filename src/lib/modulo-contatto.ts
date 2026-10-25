/**
 * Decide in build se mostrare il modulo di contatto o, al suo posto, l'invito a
 * scrivere via email. Il modulo compare solo dove può davvero recapitare i
 * messaggi, così nessuno crede di aver scritto a vuoto:
 * - PUBLIC_MODULO_CONTATTO=off (es. GitHub Pages, solo statico): mai;
 * - build su Netlify: solo se è configurato l'invio reale con Brevo
 *   (MAIL_DRIVER=brevo e BREVO_API_KEY tra le variabili d'ambiente);
 * - altrove (sviluppo locale, Cloudflare): sì.
 */
export function moduloContattoAttivo(): boolean {
  if (import.meta.env.PUBLIC_MODULO_CONTATTO === "off") return false;
  if (process.env.NETLIFY === "true") {
    return (
      process.env.MAIL_DRIVER === "brevo" && Boolean(process.env.BREVO_API_KEY)
    );
  }
  return true;
}
