// Cloudflare Worker: holds the Strava client secret, so the static site never sees it.
//   POST /token   {code} | {refresh_token}  -> Strava token exchange / refresh
//   GET  /api/*                              -> proxied to Strava API v3 (Bearer token from caller)
// Env: STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET (secret), ALLOWED_ORIGIN (e.g. https://oa-kwaku.github.io)
export default {
  async fetch(req, env) {
    const cors = {
      "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN,
      "Access-Control-Allow-Headers": "Authorization, Content-Type",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Vary": "Origin",
    };
    const json = (body, status = 200) =>
      new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (req.headers.get("Origin") !== env.ALLOWED_ORIGIN) return json({ error: "forbidden origin" }, 403);

    const url = new URL(req.url);

    if (url.pathname === "/token" && req.method === "POST") {
      const b = await req.json().catch(() => ({}));
      const form = new URLSearchParams({
        client_id: env.STRAVA_CLIENT_ID,
        client_secret: env.STRAVA_CLIENT_SECRET,
      });
      if (b.code) { form.set("code", b.code); form.set("grant_type", "authorization_code"); }
      else if (b.refresh_token) { form.set("refresh_token", b.refresh_token); form.set("grant_type", "refresh_token"); }
      else return json({ error: "code or refresh_token required" }, 400);
      const r = await fetch("https://www.strava.com/oauth/token", { method: "POST", body: form });
      const d = await r.json();
      if (!r.ok) return json({ error: d.message || "strava error" }, r.status);
      const { access_token, refresh_token, expires_at } = d;
      return json({ access_token, refresh_token, expires_at });
    }

    if (url.pathname.startsWith("/api/") && req.method === "GET") {
      const r = await fetch("https://www.strava.com/api/v3/" + url.pathname.slice(5) + url.search, {
        headers: { Authorization: req.headers.get("Authorization") || "" },
      });
      return new Response(r.body, { status: r.status, headers: { ...cors, "Content-Type": "application/json" } });
    }

    return json({ error: "not found" }, 404);
  },
};
