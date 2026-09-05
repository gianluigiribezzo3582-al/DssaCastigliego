import { describe, expect, it } from "vitest";
import {
  CAMPO_HONEYPOT,
  CAMPO_TIMESTAMP,
  honeypotCompilato,
  invioTroppoVeloce,
  verificaTurnstile,
} from "../functions/_lib/antispam";

function formData(campi: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [chiave, valore] of Object.entries(campi)) fd.set(chiave, valore);
  return fd;
}

describe("honeypotCompilato", () => {
  it("è false quando il campo honeypot è vuoto", () => {
    expect(honeypotCompilato(formData({ [CAMPO_HONEYPOT]: "" }))).toBe(false);
  });

  it("è true quando il campo honeypot contiene qualcosa (comportamento tipico di un bot)", () => {
    expect(
      honeypotCompilato(formData({ [CAMPO_HONEYPOT]: "http://spam.example" })),
    ).toBe(true);
  });
});

describe("invioTroppoVeloce", () => {
  it("è true se l'invio arriva a meno di 4 secondi dal caricamento", () => {
    const adesso = 10_000;
    const fd = formData({ [CAMPO_TIMESTAMP]: String(adesso - 1000) });
    expect(invioTroppoVeloce(fd, adesso)).toBe(true);
  });

  it("è false se l'invio arriva dopo la soglia", () => {
    const adesso = 10_000;
    const fd = formData({ [CAMPO_TIMESTAMP]: String(adesso - 5000) });
    expect(invioTroppoVeloce(fd, adesso)).toBe(false);
  });

  it("è false (controllo saltato) se il timestamp è assente, come in navigazione senza JavaScript", () => {
    const fd = formData({});
    expect(invioTroppoVeloce(fd, Date.now())).toBe(false);
  });
});

describe("verificaTurnstile", () => {
  it("passa sempre se non è configurata una secret key (Turnstile disattivato)", async () => {
    const risultato = await verificaTurnstile(undefined, null, "127.0.0.1");
    expect(risultato).toBe(true);
  });
});
