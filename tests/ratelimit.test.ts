import { beforeEach, describe, expect, it } from "vitest";
import {
  hashIp,
  limiteSuperato,
  resetRateLimitPerTest,
} from "../functions/_lib/ratelimit";

beforeEach(() => {
  resetRateLimitPerTest();
});

describe("hashIp", () => {
  it("produce lo stesso hash per lo stesso IP e sale", async () => {
    const a = await hashIp("1.2.3.4", "sale");
    const b = await hashIp("1.2.3.4", "sale");
    expect(a).toBe(b);
  });

  it("produce hash diversi per sali diversi (l'IP non è mai in chiaro)", async () => {
    const a = await hashIp("1.2.3.4", "sale-1");
    const b = await hashIp("1.2.3.4", "sale-2");
    expect(a).not.toBe(b);
    expect(a).not.toContain("1.2.3.4");
  });
});

describe("limiteSuperato", () => {
  it("consente le prime richieste entro il limite", () => {
    const chiave = "chiave-test";
    for (let i = 0; i < 5; i++) {
      expect(limiteSuperato(chiave, 1000)).toBe(false);
    }
  });

  it("blocca dopo aver superato il numero massimo di richieste nella finestra", () => {
    const chiave = "chiave-test-2";
    for (let i = 0; i < 5; i++) limiteSuperato(chiave, 1000);
    expect(limiteSuperato(chiave, 1500)).toBe(true);
  });

  it("torna a consentire dopo che la finestra temporale è scaduta", () => {
    const chiave = "chiave-test-3";
    for (let i = 0; i < 5; i++) limiteSuperato(chiave, 1000);
    expect(limiteSuperato(chiave, 1000 + 10 * 60 * 1000 + 1)).toBe(false);
  });

  it("tiene chiavi (IP hashati) diverse separate", () => {
    for (let i = 0; i < 5; i++) limiteSuperato("chiave-a", 1000);
    expect(limiteSuperato("chiave-b", 1000)).toBe(false);
  });
});
