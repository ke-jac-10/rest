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

export default async (req) => {
  const token = getToken(req);
  if (!token) return json(401, { error: "Non autenticato" });

  const sessions = getStore("resto-sessions");
  const session = await sessions.get(token, { type: "json" });
  if (!session) return json(401, { error: "Sessione scaduta, accedi di nuovo" });

  const users = getStore("resto-users");
  const record = await users.get(session.username, { type: "json" });
  if (!record) return json(401, { error: "Utente non trovato" });

  return json(200, { username: record.username, stats: record.stats });
};
