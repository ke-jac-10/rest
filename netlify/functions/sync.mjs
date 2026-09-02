import { getStore } from "@netlify/blobs";

function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function getToken(req) {
  const auth = req.headers.get("authorization") || "";
  const m = auth.match(/^Bearer (.+)$/);
  return m ? m[1] : null;
}

function cleanNumber(n, fallback) {
  return typeof n === "number" && isFinite(n) && n >= 0 ? Math.floor(n) : fallback;
}

export default async (req) => {
  if (req.method !== "POST") return json(405, { error: "Metodo non consentito" });

  const token = getToken(req);
  if (!token) return json(401, { error: "Non autenticato" });

  const sessions = getStore("resto-sessions");
  const session = await sessions.get(token, { type: "json" });
  if (!session) return json(401, { error: "Sessione scaduta, accedi di nuovo" });

  const users = getStore("resto-users");
  const record = await users.get(session.username, { type: "json" });
  if (!record) return json(401, { error: "Utente non trovato" });

  let payload;
  try {
    payload = await req.json();
  } catch {
    return json(400, { error: "Richiesta non valida" });
  }
  const incoming = payload.stats || {};

  const cur = record.stats;
  let merged;
  if (payload.reset === true) {
    // Azzeramento esplicito richiesto dall'utente: sostituisce i valori invece di
    // prendere il massimo, altrimenti l'azzeramento non avrebbe mai effetto.
    merged = {
      score: 0, served: 0, perfect: 0, okay: 0, wrong: 0, streak: 0, bestStreak: 0,
    };
  } else {
    // Il punteggio, le partite servite e i record possono solo crescere: evita che un
    // dispositivo con dati vecchi sovrascriva per sbaglio i progressi fatti altrove.
    // "streak" (la serie in corso) invece riflette lo stato attuale, quindi può anche azzerarsi.
    merged = {
      score: Math.max(cur.score, cleanNumber(incoming.score, cur.score)),
      served: Math.max(cur.served, cleanNumber(incoming.served, cur.served)),
      perfect: Math.max(cur.perfect, cleanNumber(incoming.perfect, cur.perfect)),
      okay: Math.max(cur.okay, cleanNumber(incoming.okay, cur.okay)),
      wrong: Math.max(cur.wrong, cleanNumber(incoming.wrong, cur.wrong)),
      bestStreak: Math.max(cur.bestStreak, cleanNumber(incoming.bestStreak, cur.bestStreak)),
      streak: cleanNumber(incoming.streak, cur.streak),
    };
  }

  record.stats = merged;
  await users.setJSON(session.username, record);

  return json(200, { stats: merged });
};
