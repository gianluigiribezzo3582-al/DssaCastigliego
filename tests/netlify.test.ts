import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import contatto from "../netlify/functions/contatto";
import proteggiAdmin from "../netlify/edge-functions/proteggi-admin";
import { resetRateLimitPerTest } from "../functions/_lib/ratelimit";
import { moduloContattoAttivo } from "../src/lib/modulo-contatto";

const campiValidi = {
  nome: "Giulia",
  email: "giulia@esempio.it",
  telefono: "",
  preferenza_contatto: "email",
  disponibilita: "",
  messaggio: "Vorrei fissare un primo colloquio.",
  consenso_privacy: "on",
  carica_ts: String(Date.now() - 10_000),
};

function richiestaModulo(): Request {
  const fd = new FormData();
  for (const [chiave, valore] of Object.entries(campiValidi))
    fd.set(chiave, valore);
  return new Request("https://esempio.it/api/contatto", {
    method: "POST",
    body: fd,
    headers: { accept: "application/json" },
  });
}

const variabili = [
  "CONTEXT",
  "MAIL_DRIVER",
  "NETLIFY",
  "BREVO_API_KEY",
  "RATE_LIMIT_SALT",
];

describe("Netlify Function /api/contatto", () => {
  beforeEach(() => resetRateLimitPerTest());
  afterEach(() => {
    for (const v of variabili) delete process.env[v];
    vi.restoreAllMocks();
  });

  it("in produzione senza Brevo configurato non finge l'invio (503)", async () => {
    process.env.CONTEXT = "production";
    vi.spyOn(console, "error").mockImplementation(() => {});
    const risposta = await contatto(richiestaModulo(), { ip: "203.0.113.5" });
    expect(risposta.status).toBe(503);
    const corpo = await risposta.json();
    expect(corpo.ok).toBe(false);
  });

  it("fuori dalla produzione usa il driver mock e risponde con successo", async () => {
    process.env.MAIL_DRIVER = "mock";
    process.env.RATE_LIMIT_SALT = "sale-test";
    vi.spyOn(console, "log").mockImplementation(() => {});
    const fetchSpia = vi.spyOn(globalThis, "fetch");
    const risposta = await contatto(richiestaModulo(), { ip: "203.0.113.6" });
    expect(risposta.status).toBe(200);
    expect((await risposta.json()).ok).toBe(true);
    expect(fetchSpia).not.toHaveBeenCalled();
  });
});

describe("Netlify Edge Function di protezione /admin", () => {
  const prossimo = {
    next: async () => new Response("pagina", { status: 200 }),
  };

  afterEach(() => {
    delete (globalThis as { Netlify?: unknown }).Netlify;
  });

  function impostaCredenziali(utente?: string, password?: string) {
    (globalThis as { Netlify?: unknown }).Netlify = {
      env: {
        get: (nome: string) =>
          ({
            ADMIN_BASIC_AUTH_USER: utente,
            ADMIN_BASIC_AUTH_PASS: password,
          })[nome],
      },
    };
  }

  it("blocca /admin senza credenziali quando la protezione è attiva", async () => {
    impostaCredenziali("elisa", "segreta");
    const risposta = await proteggiAdmin(
      new Request("https://esempio.it/admin/"),
      prossimo,
    );
    expect(risposta.status).toBe(401);
  });

  it("lascia passare /admin con le credenziali giuste", async () => {
    impostaCredenziali("elisa", "segreta");
    const risposta = await proteggiAdmin(
      new Request("https://esempio.it/admin/", {
        headers: { authorization: `Basic ${btoa("elisa:segreta")}` },
      }),
      prossimo,
    );
    expect(risposta.status).toBe(200);
  });

  it("senza credenziali configurate non blocca nulla", async () => {
    impostaCredenziali();
    const risposta = await proteggiAdmin(
      new Request("https://esempio.it/admin/"),
      prossimo,
    );
    expect(risposta.status).toBe(200);
  });
});

describe("moduloContattoAttivo", () => {
  afterEach(() => {
    for (const v of variabili) delete process.env[v];
  });

  it("su Netlify è spento finché Brevo non è configurato", () => {
    process.env.NETLIFY = "true";
    expect(moduloContattoAttivo()).toBe(false);
    process.env.MAIL_DRIVER = "brevo";
    process.env.BREVO_API_KEY = "chiave-finta";
    expect(moduloContattoAttivo()).toBe(true);
  });

  it("in sviluppo locale è acceso", () => {
    expect(moduloContattoAttivo()).toBe(true);
  });
});
