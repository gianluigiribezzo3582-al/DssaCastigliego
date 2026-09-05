import type { DatiContatto } from "../validazione";

export interface EsitoInvio {
  ok: boolean;
  errore?: string;
}

export interface DriverMail {
  invia(dati: DatiContatto): Promise<EsitoInvio>;
}
