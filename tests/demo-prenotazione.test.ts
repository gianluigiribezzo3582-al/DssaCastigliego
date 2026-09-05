import { describe, expect, it } from "vitest";
import {
  generaCalendarioMese,
  orariDisponibili,
} from "../src/lib/demo-prenotazione/config";

describe("orariDisponibili", () => {
  it("è deterministico: stesso input, stesso risultato ad ogni chiamata", () => {
    const a = orariDisponibili(12, 2);
    const b = orariDisponibili(12, 2);
    expect(a).toEqual(b);
  });

  it("non produce slot per un giorno della settimana senza configurazione (weekend)", () => {
    expect(orariDisponibili(10, 6)).toEqual([]);
    expect(orariDisponibili(10, 0)).toEqual([]);
  });
});

describe("generaCalendarioMese", () => {
  it("genera lo stesso calendario a chiamate ripetute (stabile tra i refresh)", () => {
    const a = generaCalendarioMese(2026, 2);
    const b = generaCalendarioMese(2026, 2);
    expect(a.map((g) => g.slotDisponibili)).toEqual(
      b.map((g) => g.slotDisponibili),
    );
  });

  it("genera un giorno per ogni giorno del mese", () => {
    const marzo2026 = generaCalendarioMese(2026, 2); // marzo ha 31 giorni
    expect(marzo2026).toHaveLength(31);
  });

  it("non propone slot nei weekend", () => {
    const calendario = generaCalendarioMese(2026, 2);
    const weekend = calendario.filter((g) => g.weekend);
    expect(weekend.every((g) => g.slotDisponibili.length === 0)).toBe(true);
  });

  it("non propone slot nei giorni già passati", () => {
    const calendario = generaCalendarioMese(2020, 0); // gennaio 2020: tutto nel passato
    expect(calendario.every((g) => g.passato)).toBe(true);
    expect(calendario.every((g) => g.slotDisponibili.length === 0)).toBe(true);
  });
});
