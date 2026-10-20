# CMS — setup (una vez)

Panel: `/admin` (Decap). Fotos en GitHub. Textos siguen en [Google Sheets](./README.md).

## 1. GitHub OAuth App

1. GitHub → **Settings → Developer settings → OAuth Apps → New OAuth App**.
2. Application name: `Laureles CMS`.
3. Homepage URL: `https://ivanabraz.github.io/laureles` (o tu dominio).
4. Authorization callback URL: `https://TU_WORKER.workers.dev/callback`.
5. Guardá **Client ID** y generá **Client Secret**.

## 2. Cloudflare Worker (gratis)

1. [Cloudflare Workers](https://workers.cloudflare.com) → Create Worker.
2. Pegá el código de [`cms-oauth-worker.js`](./cms-oauth-worker.js).
3. Variables / secrets:
   - `GITHUB_CLIENT_ID`
   - `GITHUB_CLIENT_SECRET`
4. Deploy y copiá la URL (`https://….workers.dev`).

## 3. Config del admin

En [`public/admin/config.yml`](../public/admin/config.yml):

```yaml
backend:
  base_url: https://TU_WORKER.workers.dev
```

Commit y push.

## 4. Acceso de Laura

1. Repo `ivanabraz/laureles` → **Settings → Collaborators** → invitar su GitHub (rol Write).
2. Pedirle **2FA** en GitHub.
3. Pasarle el link: `https://ivanabraz.github.io/laureles/admin/` (o tu dominio + `/admin/`).

## 5. GitHub Pages

1. Repo → **Settings → Pages**.
2. Source: **GitHub Actions**.
3. El workflow [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml) publica en cada push a `main`.
4. (Opcional) Secrets del repo para el Sheet:
   - `REACT_APP_GOOGLE_SHEETS_ID`
   - `REACT_APP_GOOGLE_SHEETS_TAB`

Si usás dominio custom en la raíz, cambiá `homepage` en `package.json` a esa URL.

## Local (opcional)

```bash
# Terminal 1
npm start

# Terminal 2 — proxy local sin OAuth
npm run cms
```

Abrí `http://localhost:3000/admin/` (con `local_backend: true` en config).

## Límite de imágenes

Máximo **1 MB** por archivo (config + validación en el admin).
