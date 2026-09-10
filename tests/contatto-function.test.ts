import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { onRequestPost } from "../functions/api/contatto";
import { resetRateLimitPerTest } from "../functions/_lib/ratelimit";

function richiesta(campi: Record<string, string>, accettaJson = true): Request {
  const fd = new FormData();
  for (const [chiave, valore] of Object.entries(campi)) fd.set(chiave, valore);
  const headers: Record<string, string> = {
    "cf-connecting-ip": "203.0.113.10",
  };
  if (accettaJson) headers.accept = "application/json";
  return new Request("https://esempio.it/api/contatto", {
    method: "POST",
    body: fd,
    headers,
  });
}

const campiValidi = {
  nome: "Giulia",
  email: "giulia@esempio.it",
  telefono: "",
  preferenza_contatto: "email",
  disponibilita: "",
  messaggio: "Vorrei fissare un primo colloquio.",
  consenso_privacy: "on",
  carica_ts: String(Date.now() - 10_000), // oltre la soglia time-trap
};

function contesto(campi: Record<string, string>, accettaJson = true) {
  return {
    request: richiesta(campi, accettaJson),
    env: { MAIL_DRIVER: "mock", RATE_LIMIT_SALT: "sale-test" },
  } as any;
}

describe("onRequestPost /api/contatto", () => {
  beforeEach(() => {
    resetRateLimitPerTest();
  });

  it("in modalità mock non effettua alcuna chiamata di rete", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const risposta = await onRequestPost(contesto(campiValidi));
    const corpo = await risposta.json();

    expect(corpo.ok).toBe(true);
    expect(fetchSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });

  it("in modalità mock restituisce un'anteprima leggibile dell'email nella risposta JSON, utile per una demo", async () => {
    const risposta = await onRequestPost(contesto(campiValidi));
    const corpo = await risposta.json();

    expect(corpo.ok).toBe(true);
    expect(typeof corpo.anteprimaEmail).toBe("string");
    expect(corpo.anteprimaEmail).toContain(campiValidi.nome);
    expect(corpo.anteprimaEmail).toContain(campiValidi.messaggio);
  });

  it("non include l'anteprima email nel redirect senza JavaScript (non applicabile a una risposta HTML)", async () => {
    const risposta = await onRequestPost(contesto(campiValidi, false));
    expect(risposta.status).toBe(303);
    expect(await risposta.text()).toBe("");
  });

  it("restituisce errori di validazione se un campo obbligatorio manca", async () => {
    const risposta = await onRequestPost(
      contesto({ ...campiValidi, nome: "" }),
    );
    expect(risposta.status).toBe(400);
    const corpo = await risposta.json();
    expect(corpo.ok).toBe(false);
    expect(corpo.errori.nome).toBeDefined();
  });

  it("finge un successo se l'honeypot è compilato, senza inviare nulla", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const risposta = await onRequestPost(
      contesto({ ...campiValidi, sito_web_personale: "http://spam.example" }),
    );
    const corpo = await risposta.json();

    expect(risposta.status).toBe(200);
    expect(corpo.ok).toBe(true);
    expect(fetchSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });

  it("rifiuta un invio troppo rapido rispetto al caricamento della pagina (time-trap)", async () => {
    const risposta = await onRequestPost(
      contesto({ ...campiValidi, carica_ts: String(Date.now() - 500) }),
    );
    expect(risposta.status).toBe(400);
  });

  it("applica il rate limit dopo troppe richieste dallo stesso IP", async () => {
    let ultimaRisposta: Response | null = null;
    for (let i = 0; i < 6; i++) {
      ultimaRisposta = await onRequestPost(contesto(campiValidi));
    }
    expect(ultimaRisposta!.status).toBe(429);
  });

  it("senza Accept: application/json risponde con un redirect 303 sul successo (percorso senza JavaScript)", async () => {
    const risposta = await onRequestPost(contesto(campiValidi, false));
    expect(risposta.status).toBe(303);
    expect(risposta.headers.get("location")).toBe("/contatti/grazie");
  });
});
