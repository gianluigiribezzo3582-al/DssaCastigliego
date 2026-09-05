// Configurazione degli slot finti mostrati nella demo di prenotazione
// (src/pages/demo-prenotazione). Puramente dimostrativa: nessuna disponibilità qui
// è reale. Gli orari sono calcolati con una funzione deterministica a partire da
// questo file — stessa data, stesso risultato ad ogni ricarica della pagina — non
// generati a caso.

/** Orari possibili per giorno della settimana (0 = domenica ... 6 = sabato). Nessuno slot nel weekend. */
export const ORARI_SETTIMANALI: Record<number, string[]> = {
  1: ["09:00", "10:00", "11:00", "15:00", "16:00"], // lunedì
  2: ["09:00", "10:00", "14:00", "15:00", "16:00", "17:00"], // martedì
  3: ["10:00", "11:00", "15:00", "16:00"], // mercoledì
  4: ["09:00", "10:00", "11:00", "14:00", "15:00"], // giovedì
  5: ["09:00", "11:00", "14:00", "15:00"], // venerdì
};

/**
 * Rimuove deterministicamente alcuni slot per rendere il calendario più
 * verosimile (non tutti gli orari sono sempre liberi), senza usare valori
 * casuali: dipende solo dal numero del giorno nel mese, quindi resta stabile
 * tra un caricamento e l'altro.
 */
export function orariDisponibili(
  giornoDelMese: number,
  giornoSettimana: number,
): string[] {
  const base = ORARI_SETTIMANALI[giornoSettimana] ?? [];
  return base.filter((_, indice) => (giornoDelMese + indice) % 4 !== 0);
}

export interface GiornoCalendario {
  data: Date;
  slotDisponibili: string[];
  passato: boolean;
  weekend: boolean;
}

/** Genera il calendario di un mese (anno, mese 0-indicizzato come Date). */
export function generaCalendarioMese(
  anno: number,
  mese: number,
): GiornoCalendario[] {
  const oggi = new Date();
  oggi.setHours(0, 0, 0, 0);

  const giorniNelMese = new Date(anno, mese + 1, 0).getDate();
  const giorni: GiornoCalendario[] = [];

  for (let giorno = 1; giorno <= giorniNelMese; giorno++) {
    const data = new Date(anno, mese, giorno);
    const giornoSettimana = data.getDay();
    const weekend = giornoSettimana === 0 || giornoSettimana === 6;
    const passato = data < oggi;
    const slotDisponibili =
      !weekend && !passato ? orariDisponibili(giorno, giornoSettimana) : [];

    giorni.push({ data, slotDisponibili, passato, weekend });
  }

  return giorni;
}

export const NOMI_MESI = [
  "Gennaio",
  "Febbraio",
  "Marzo",
  "Aprile",
  "Maggio",
  "Giugno",
  "Luglio",
  "Agosto",
  "Settembre",
  "Ottobre",
  "Novembre",
  "Dicembre",
];

export const NOMI_GIORNI_BREVI = [
  "Lun",
  "Mar",
  "Mer",
  "Gio",
  "Ven",
  "Sab",
  "Dom",
];
