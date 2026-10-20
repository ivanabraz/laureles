# Laureles

Sitio de Laureles Audiovisual (React / CRA).

## Contenido editable

- **Textos (ES/EN):** [Google Sheets](content/README.md)
- **Fotos (portfolio + paquetes):** Decap CMS en `/admin` — [setup](content/cms-setup.md) · [guía Laura](content/cms-laura.md)

## Desarrollo

```bash
npm install
npm start
```

CMS en local (opcional, segunda terminal):

```bash
npm run cms
```

Luego `http://localhost:3000/admin/`.

## Deploy

Push a `main` → GitHub Actions → GitHub Pages (`homepage` en `package.json`).
