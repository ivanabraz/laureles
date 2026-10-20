/**
 * Cloudflare Worker — OAuth proxy for Decap CMS + GitHub
 *
 * Secrets:
 *   - GITHUB_CLIENT_ID
 *   - GITHUB_CLIENT_SECRET
 *
 * Redirect URI in GitHub OAuth App:
 *   https://laureles-cms-oauth.braz-ivana.workers.dev/callback
 */

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: CORS });
    }

    if (url.pathname === "/auth") {
      const redirect =
        "https://github.com/login/oauth/authorize" +
        `?client_id=${encodeURIComponent(env.GITHUB_CLIENT_ID)}` +
        "&scope=repo,user";
      return Response.redirect(redirect, 302);
    }

    if (url.pathname === "/callback") {
      const code = url.searchParams.get("code");
      if (!code) {
        return new Response("Missing code", { status: 400, headers: CORS });
      }

      const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: env.GITHUB_CLIENT_ID,
          client_secret: env.GITHUB_CLIENT_SECRET,
          code,
        }),
      });

      const data = await tokenRes.json();

      if (!data.access_token) {
        return new Response(
          `OAuth error: ${data.error || "no access_token"} — ${data.error_description || JSON.stringify(data)}`,
          { status: 400, headers: CORS }
        );
      }

      // Decap expects { token, provider } — NOT GitHub's { access_token, ... }
      const payload = JSON.stringify({
        token: data.access_token,
        provider: "github",
      });

      const content = `<!DOCTYPE html>
<html><body>
<script>
(function () {
  function receiveMessage(e) {
    window.opener.postMessage(
      'authorization:github:success:${payload}',
      e.origin
    );
    window.removeEventListener("message", receiveMessage, false);
  }
  window.addEventListener("message", receiveMessage, false);
  window.opener.postMessage("authorizing:github", "*");
})();
</script>
</body></html>`;

      return new Response(content, {
        headers: { "Content-Type": "text/html;charset=utf-8", ...CORS },
      });
    }

    return new Response("Decap CMS OAuth proxy OK", { headers: CORS });
  },
};
