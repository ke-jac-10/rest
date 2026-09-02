import { getStore } from "@netlify/blobs";
import { randomBytes, scrypt as scryptCb } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCb);
const USERNAME_RE = /^[A-Za-z0-9_]{3,20}$/;

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

  if (!USERNAME_RE.test(username)) {
    return json(400, { error: "Il nome utente deve avere 3-20 caratteri: lettere, numeri o _" });
  }
  if (password.length < 6 || password.length > 128) {
    return json(400, { error: "La password deve avere almeno 6 caratteri" });
  }

  const users = getStore("resto-users");
  const key = username.toLowerCase();

  const existing = await users.get(key, { type: "json" });
  if (existing) {
    return json(409, { error: "Questo nome utente è già in uso" });
  }

  const salt = randomBytes(16).toString("hex");
  const hash = (await scrypt(password, salt, 64)).toString("hex");

  const stats = { score: 0, served: 0, perfect: 0, okay: 0, wrong: 0, streak: 0, bestStreak: 0 };
  const record = { username, salt, hash, stats, createdAt: Date.now() };
  await users.setJSON(key, record);

  const sessions = getStore("resto-sessions");
  const token = randomBytes(32).toString("hex");
  await sessions.setJSON(token, { username: key, createdAt: Date.now() });

  return json(200, { token, username, stats });
};
