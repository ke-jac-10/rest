import { getStore } from "@netlify/blobs";
import { randomBytes, scrypt as scryptCb, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCb);

function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export default async (req) => {
  if (req.method !== "POST") return json(405, { error: "Metodo non consentito" });

  let body;
  try {
    body = await req.json();
  } catch {
    return json(400, { error: "Richiesta non valida" });
  }

  const username = String(body.username || "").trim();
  const password = String(body.password || "");
  const key = username.toLowerCase();

  const users = getStore("resto-users");
  const record = await users.get(key, { type: "json" });

  const fail = () => json(401, { error: "Nome utente o password non corretti" });

  if (!record) return fail();

  const hash = (await scrypt(password, record.salt, 64)).toString("hex");
  const a = Buffer.from(hash, "hex");
  const b = Buffer.from(record.hash, "hex");
  const ok = a.length === b.length && timingSafeEqual(a, b);
  if (!ok) return fail();

  const sessions = getStore("resto-sessions");
  const token = randomBytes(32).toString("hex");
  await sessions.setJSON(token, { username: key, createdAt: Date.now() });

  return json(200, { token, username: record.username, stats: record.stats });
};
