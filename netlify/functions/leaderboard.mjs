import { getStore } from "@netlify/blobs";

function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export default async () => {
  const users = getStore("resto-users");
  const { blobs } = await users.list();

  const all = [];
  // Scansione semplice: adatta a un progetto di piccole dimensioni.
  for (const b of blobs.slice(0, 500)) {
    const record = await users.get(b.key, { type: "json" });
    if (record && record.stats) {
      all.push({
        username: record.username,
        score: record.stats.score,
        bestStreak: record.stats.bestStreak,
      });
    }
  }

  all.sort((a, b) => b.score - a.score || b.bestStreak - a.bestStreak);

  return json(200, { leaderboard: all.slice(0, 10) });
};
