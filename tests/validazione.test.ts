import { describe, expect, it } from "vitest";
import { valida } from "../functions/_lib/validazione";

function formData(campi: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [chiave, valore] of Object.entries(campi)) fd.set(chiave, valore);
  return fd;
}

const datiValidiBase = {
  nome: "Maria",
  email: "maria@esempio.it",
  telefono: "",
  preferenza_contatto: "email",
  disponibilita: "",
  messaggio: "Vorrei informazioni su un primo colloquio.",
  consenso_privacy: "on",
};

describe("valida", () => {
  it("accetta un invio completo e corretto", () => {
    const esito = valida(formData(datiValidiBase));
    expect(esito.ok).toBe(true);
    expect(esito.dati?.nome).toBe("Maria");
  });

  it("rifiuta se manca il nome", () => {
    const esito = valida(formData({ ...datiValidiBase, nome: "" }));
    expect(esito.ok).toBe(false);
    expect(esito.errori.nome).toBeDefined();
  });

  it("rifiuta se mancano sia email che telefono", () => {
    const esito = valida(
      formData({ ...datiValidiBase, email: "", telefono: "" }),
    );
    expect(esito.ok).toBe(false);
    expect(esito.errori.recapito).toBeDefined();
  });

  it("accetta se è presente solo il telefono", () => {
    const esito = valida(
      formData({ ...datiValidiBase, email: "", telefono: "051 1234567" }),
    );
    expect(esito.ok).toBe(true);
  });

  it("rifiuta un'email malformata", () => {
    const esito = valida(
      formData({ ...datiValidiBase, email: "non-una-email" }),
    );
    expect(esito.ok).toBe(false);
    expect(esito.errori.email).toBeDefined();
  });

  it("rifiuta se manca la preferenza di contatto", () => {
    const esito = valida(
      formData({ ...datiValidiBase, preferenza_contatto: "" }),
    );
    expect(esito.ok).toBe(false);
    expect(esito.errori.preferenza_contatto).toBeDefined();
  });

  it("rifiuta se manca il consenso privacy", () => {
    const esito = valida(formData({ ...datiValidiBase, consenso_privacy: "" }));
    expect(esito.ok).toBe(false);
    expect(esito.errori.consenso_privacy).toBeDefined();
  });

  it("rifiuta un messaggio vuoto", () => {
    const esito = valida(formData({ ...datiValidiBase, messaggio: "" }));
    expect(esito.ok).toBe(false);
    expect(esito.errori.messaggio).toBeDefined();
  });
});
