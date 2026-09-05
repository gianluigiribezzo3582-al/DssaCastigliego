import type { DriverMail } from "./tipi";
import { driverMock } from "./mock";
import { creaDriverBrevo } from "./brevo";

export interface EnvMail {
  MAIL_DRIVER?: string;
  BREVO_API_KEY?: string;
  BREVO_MITTENTE_EMAIL?: string;
  BREVO_MITTENTE_NOME?: string;
  DESTINATARIO_EMAIL?: string;
}

/**
 * MAIL_DRIVER=mock (default) o MAIL_DRIVER=brevo. Qualunque valore diverso da
 * "brevo" ricade sul mock: di proposito, per non rischiare invii reali per errore
 * di configurazione. Vedi README e /docs/DEPLOY.md.
 */
export function scegliDriverMail(env: EnvMail): DriverMail {
  if (env.MAIL_DRIVER === "brevo") {
    if (
      !env.BREVO_API_KEY ||
      !env.BREVO_MITTENTE_EMAIL ||
      !env.DESTINATARIO_EMAIL
    ) {
      throw new Error(
        "MAIL_DRIVER=brevo richiede BREVO_API_KEY, BREVO_MITTENTE_EMAIL e DESTINATARIO_EMAIL.",
      );
    }
    return creaDriverBrevo({
      apiKey: env.BREVO_API_KEY,
      mittenteEmail: env.BREVO_MITTENTE_EMAIL,
      mittenteNome: env.BREVO_MITTENTE_NOME ?? "Sito Elisa Castigliego",
      destinatarioEmail: env.DESTINATARIO_EMAIL,
    });
  }

  return driverMock;
}
