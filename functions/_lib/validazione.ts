// Validazione del modulo di contatto. Nessun campo relativo allo stato di salute:
// il modulo lo esclude di proposito, vedi l'avviso mostrato sopra il campo messaggio
// in src/pages/contatti.astro.

export interface DatiContatto {
  nome: string;
  email: string;
  telefono: string;
  preferenzaContatto: "email" | "telefono";
  disponibilita: string;
  messaggio: string;
  consensoPrivacy: boolean;
}

export interface EsitoValidazione {
  ok: boolean;
  dati?: DatiContatto;
  errori: Record<string, string>;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Accetta cifre, spazi e i separatori comuni (+, -, parentesi); niente lettere.
const TELEFONO_REGEX = /^[0-9+\-()\s]{6,20}$/;

function stringa(formData: FormData, campo: string): string {
  const valore = formData.get(campo);
  return typeof valore === "string" ? valore.trim() : "";
}

export function valida(formData: FormData): EsitoValidazione {
  const errori: Record<string, string> = {};

  const nome = stringa(formData, "nome");
  const email = stringa(formData, "email");
  const telefono = stringa(formData, "telefono");
  const preferenzaContattoRaw = stringa(formData, "preferenza_contatto");
  const disponibilita = stringa(formData, "disponibilita");
  const messaggio = stringa(formData, "messaggio");
  const consensoPrivacy = formData.get("consenso_privacy") === "on";

  if (!nome || nome.length > 120) {
    errori.nome =
      "Inserisci un nome o un identificativo (massimo 120 caratteri).";
  }

  if (email && !EMAIL_REGEX.test(email)) {
    errori.email = "L'indirizzo email inserito non sembra valido.";
  }

  if (telefono && !TELEFONO_REGEX.test(telefono)) {
    errori.telefono = "Il numero di telefono inserito non sembra valido.";
  }

  if (!email && !telefono) {
    errori.recapito = "Inserisci almeno un recapito: email o telefono.";
  }

  const preferenzeValide = ["email", "telefono"] as const;
  if (
    !preferenzeValide.includes(
      preferenzaContattoRaw as (typeof preferenzeValide)[number],
    )
  ) {
    errori.preferenza_contatto =
      "Indica come preferisci essere ricontattata/o.";
  }

  if (disponibilita.length > 300) {
    errori.disponibilita =
      "Il campo disponibilità è troppo lungo (massimo 300 caratteri).";
  }

  if (!messaggio || messaggio.length > 2000) {
    errori.messaggio = "Scrivi un messaggio (massimo 2000 caratteri).";
  }

  if (!consensoPrivacy) {
    errori.consenso_privacy =
      "È necessario prendere visione dell'informativa privacy per proseguire.";
  }

  if (Object.keys(errori).length > 0) {
    return { ok: false, errori };
  }

  return {
    ok: true,
    errori: {},
    dati: {
      nome,
      email,
      telefono,
      preferenzaContatto:
        preferenzaContattoRaw as DatiContatto["preferenzaContatto"],
      disponibilita,
      messaggio,
      consensoPrivacy,
    },
  };
}
