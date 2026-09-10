import { describe, expect, it } from "vitest";
import { onRequest } from "../functions/_middleware";

function contesto(
  percorso: string,
  env: Record<string, string | undefined>,
  headers: Record<string, string> = {},
) {
  const rispostaSegnaposto = new Response("contenuto della pagina", {
    status: 200,
  });
  return {
    request: new Request(`https://esempio.it${percorso}`, { headers }),
    env,
    next: async () => rispostaSegnaposto,
  } as any;
}

describe("middleware di protezione /admin", () => {
  it("lascia passare le rotte pubbliche senza controlli", async () => {
    const risposta = await onRequest(contesto("/contatti", {}));
    expect(risposta.status).toBe(200);
  });

  it("se le variabili d'ambiente non sono impostate, lascia passare anche /admin (comportamento di default in locale)", async () => {
    const risposta = await onRequest(contesto("/admin", {}));
    expect(risposta.status).toBe(200);
  });

  it("blocca /admin con 401 se le credenziali sono impostate ma non fornite", async () => {
    const risposta = await onRequest(
      contesto("/admin", {
        ADMIN_BASIC_AUTH_USER: "elisa",
        ADMIN_BASIC_AUTH_PASS: "segreta",
      }),
    );
    expect(risposta.status).toBe(401);
    expect(risposta.headers.get("www-authenticate")).toContain("Basic");
  });

  it("blocca anche i sotto-percorsi di /admin (es. /admin/guida)", async () => {
    const risposta = await onRequest(
      contesto("/admin/guida", {
        ADMIN_BASIC_AUTH_USER: "elisa",
        ADMIN_BASIC_AUTH_PASS: "segreta",
      }),
    );
    expect(risposta.status).toBe(401);
  });

  it("blocca con credenziali sbagliate", async () => {
    const risposta = await onRequest(
      contesto(
        "/admin",
        { ADMIN_BASIC_AUTH_USER: "elisa", ADMIN_BASIC_AUTH_PASS: "segreta" },
        { authorization: `Basic ${btoa("elisa:sbagliata")}` },
      ),
    );
    expect(risposta.status).toBe(401);
  });

  it("lascia passare con le credenziali corrette", async () => {
    const risposta = await onRequest(
      contesto(
        "/admin",
        { ADMIN_BASIC_AUTH_USER: "elisa", ADMIN_BASIC_AUTH_PASS: "segreta" },
        { authorization: `Basic ${btoa("elisa:segreta")}` },
      ),
    );
    expect(risposta.status).toBe(200);
  });
});
