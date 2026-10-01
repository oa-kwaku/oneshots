# Race Effort HR Ranges

Static web app: enter (or pull from Strava) your threshold heart rate and get marathon, half marathon and 5K HR targets plus Friel training zones.

Live: https://oa-kwaku.github.io/oneshots/

## Strava hookup

Strava's OAuth needs a client secret, so a tiny Cloudflare Worker (`worker/`) holds it. The page never sees it.

1. Create an API app at https://www.strava.com/settings/api
   - Authorization Callback Domain: `oa-kwaku.github.io`
2. Deploy the worker:
   ```
   cd worker
   # put your Client ID in wrangler.toml
   npx wrangler secret put STRAVA_CLIENT_SECRET
   npx wrangler deploy
   ```
3. In `index.html`, set `CONFIG.CLIENT_ID` and `CONFIG.WORKER_URL` (the `*.workers.dev` URL from step 2).
4. Push to `main`. Open the site and click **Connect Strava**.

The app reads your last 90 days of runs (25+ min, with HR), finds your best 20-minute average HR in the 6 highest-HR runs, and multiplies by 0.95 (Friel field-test estimate). Hard training runs under-read a true all-out test, so treat it as a floor and edit the number if you know better. Tokens are stored in your browser's localStorage only.
