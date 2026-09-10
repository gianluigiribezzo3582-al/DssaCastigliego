import type { DatiContatto } from "../validazione";

export interface EsitoInvio {
  ok: boolean;
  errore?: string;
  /**
   * Testo dell'email che sarebbe partita, valorizzato SOLO dal driver "mock"
   * (mai da "brevo"): serve a mostrare un'anteprima nel browser di chi sta
   * provando il form in sviluppo/demo, senza inviare né salvare nulla.
   */
  anteprimaEmail?: string;
}

export interface DriverMail {
  invia(dati: DatiContatto): Promise<EsitoInvio>;
}
