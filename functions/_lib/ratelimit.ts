// Rate limiting per IP, senza persistenza: la mappa vive in memoria del singolo
// isolate della Function e si azzera ad ogni riavvio/deploy. Coerente col vincolo
// "nessuna persistenza": non usa KV né altro storage. Vedi /docs/BLOCCHI.md (voce 5)
// per il compromesso accettato su un volume di traffico atteso molto basso.
//
// La chiave usata NON è l'IP in chiaro ma un hash (IP + sale segreto), e non viene
// mai associata al contenuto del messaggio: serve solo a contare i tentativi.

const MAX_RICHIESTE = 5;
const FINESTRA_MS = 10 * 60 * 1000; // 10 minuti

const tentativiPerChiave = new Map<string, number[]>();

export async function hashIp(ip: string, sale: string): Promise<string> {
  const encoder = new TextEncoder();
  const dati = encoder.encode(`${sale}:${ip}`);
  const digest = await crypto.subtle.digest("SHA-256", dati);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Ripulisce le voci scadute per evitare una crescita indefinita della mappa. */
function pulisci(adesso: number) {
  for (const [chiave, tentativi] of tentativiPerChiave) {
    const recenti = tentativi.filter((t) => adesso - t < FINESTRA_MS);
    if (recenti.length === 0) {
      tentativiPerChiave.delete(chiave);
    } else {
      tentativiPerChiave.set(chiave, recenti);
    }
  }
}

/**
 * Registra un tentativo per la chiave data e restituisce true se il limite è
 * superato (richiesta da rifiutare).
 */
export function limiteSuperato(chiave: string, adesso = Date.now()): boolean {
  pulisci(adesso);

  const tentativi = tentativiPerChiave.get(chiave) ?? [];
  const recenti = tentativi.filter((t) => adesso - t < FINESTRA_MS);

  if (recenti.length >= MAX_RICHIESTE) {
    tentativiPerChiave.set(chiave, recenti);
    return true;
  }

  recenti.push(adesso);
  tentativiPerChiave.set(chiave, recenti);
  return false;
}

/** Solo per i test: azzera lo stato in memoria tra un test e l'altro. */
export function resetRateLimitPerTest() {
  tentativiPerChiave.clear();
}
