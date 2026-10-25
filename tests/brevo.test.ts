import { afterEach, describe, expect, it, vi } from "vitest";
import { creaDriverBrevo } from "../functions/_lib/mail/brevo";

const driver = creaDriverBrevo({
  apiKey: "chiave-finta",
  mittenteEmail: "sito@esempio.it",
  mittenteNome: "Sito",
  destinatarioEmail: "dest@esempio.it",
});

const dati = {
  nome: "Giulia",
  email: "giulia@esempio.it",
  telefono: "",
  preferenzaContatto: "email" as const,
  disponibilita: "",
  messaggio: "Ciao",
  consensoPrivacy: true,
};

describe("driver Brevo", () => {
  afterEach(() => vi.restoreAllMocks());

  it("riporta codice e messaggio dell'errore di Brevo", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({ code: "unauthorized", message: "Key not found" }),
        { status: 401 },
      ),
    );
    const esito = await driver.invia(dati);
    expect(esito.ok).toBe(false);
    expect(esito.errore).toBe(
      "Brevo ha risposto con stato 401 (unauthorized: Key not found)",
    );
  });

  it("invia con mittente, destinatario e rispondi-a corretti", async () => {
    const spia = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response("{}", { status: 201 }));
    expect((await driver.invia(dati)).ok).toBe(true);
    const corpo = JSON.parse(String(spia.mock.calls[0][1]?.body));
    expect(corpo.sender.email).toBe("sito@esempio.it");
    expect(corpo.to[0].email).toBe("dest@esempio.it");
    expect(corpo.replyTo.email).toBe("giulia@esempio.it");
  });
});
