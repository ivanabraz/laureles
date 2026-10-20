# CMS — setup (una vez)

**Sitio oficial:** https://laureles.netlify.app  
**Admin:** https://laureles.netlify.app/admin/  

Fotos vía Decap + GitHub. Textos en [Google Sheets](./README.md).

## 1. GitHub OAuth App

1. GitHub → **Settings → Developer settings → OAuth Apps → New OAuth App**.
2. Application name: `Laureles CMS`.
3. Homepage URL: `https://laureles.netlify.app`
4. Authorization callback URL: `https://laureles-cms-oauth.braz-ivana.workers.dev/callback`
5. Guardá **Client ID** y generá **Client Secret**.

## 2. Cloudflare Worker (gratis)

1. [Cloudflare Workers](https://workers.cloudflare.com) → Create Worker.
2. Pegá el código de [`cms-oauth-worker.js`](./cms-oauth-worker.js).
3. Variables / secrets:
   - `GITHUB_CLIENT_ID`
   - `GITHUB_CLIENT_SECRET`
4. Deploy. URL actual: `https://laureles-cms-oauth.braz-ivana.workers.dev`

## 3. Config del admin

En [`public/admin/config.yml`](../public/admin/config.yml):

- `backend.base_url` → URL del Worker
- `site_url` / `display_url` → `https://laureles.netlify.app`
- Portfolio unificado en `src/data/portfolio.json` (categoría + estilo + pastilla por foto)

## 4. Acceso de Laura

1. Repo `ivanabraz/laureles` → **Settings → Collaborators** → invitar su GitHub (Write).
2. Pedirle **2FA** en GitHub.
3. Link: https://laureles.netlify.app/admin/

## 5. Deploy (Netlify)

Netlify está conectado al repo: cada push a `main` rebuilda el sitio (incluido `/admin`).

Variables útiles en Netlify (si hace falta el Sheet en build):

- `REACT_APP_GOOGLE_SHEETS_ID`
- `REACT_APP_GOOGLE_SHEETS_TAB`

## Local (opcional)

```bash
# Terminal 1
npm start

# Terminal 2 — proxy local sin OAuth
npm run cms
```

Abrí `http://localhost:3000/admin/` (con `local_backend: true` en config).

## Límite de imágenes

Máximo **1 MB** por archivo (validación en el admin).
