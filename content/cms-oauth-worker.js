/**
 * Cloudflare Worker — OAuth proxy for Decap CMS + GitHub
 *
 * 1. Create a Cloudflare Worker and paste this file.
 * 2. Add secrets / vars:
 *    - GITHUB_CLIENT_ID
 *    - GITHUB_CLIENT_SECRET
 * 3. Put the Worker URL in public/admin/config.yml → backend.base_url
 * 4. GitHub OAuth App Authorization callback URL:
 *    https://YOUR_WORKER.workers.dev/callback
 *
 * Based on the common Decap/Netlify CMS GitHub OAuth pattern.
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
      const provider = "github";
      const redirect = `https://github.com/login/oauth/authorize?client_id=${env.GITHUB_CLIENT_ID}&scope=repo,user`;
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
      const content = `
        <script>
          (function () {
            function receiveMessage(e) {
              window.opener.postMessage(
                'authorization:github:success:${JSON.stringify(data)}',
                e.origin
              );
              window.removeEventListener("message", receiveMessage, false);
            }
            window.addEventListener("message", receiveMessage, false);
            window.opener.postMessage("authorizing:github", "*");
          })();
        </script>
      `;
      return new Response(content, {
        headers: { "Content-Type": "text/html;charset=utf-8", ...CORS },
      });
    }

    return new Response("Decap CMS OAuth proxy OK", { headers: CORS });
  },
};
