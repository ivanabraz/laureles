# Textos de la web (Google Sheets)

Laura edita el Sheet; la web lee los textos al cargar (vía [OpenSheet](https://opensheet.elk.sh)).

**Fotos (portfolio / paquetes):** panel Decap en `/admin` — ver [cms-laura.md](./cms-laura.md) (Laura) y [cms-setup.md](./cms-setup.md) (setup técnico).

**Sheet actual:**  
https://docs.google.com/spreadsheets/d/1W2FEMkSrCnZf4y6trgttgRrGS222W_YrtXUA4jpVmnk

## Setup (una vez)

### 1. Importar el CSV (si la hoja está vacía)

1. Abrí el Sheet.
2. **Archivo → Importar → Subir** → [`locales-seed.csv`](./locales-seed.csv).
3. “Reemplazar hoja actual”, separador comas.
4. Columnas: `key` | `es` | `en`.

### 2. Hacer el Sheet legible por la web (obligatorio)

1. **Compartir** (botón arriba a la derecha).
2. **Acceso general** → **Cualquiera con el enlace**.
3. Rol: **Lector** (Viewer).
4. Guardar.

Sin esto, la web no puede leer el Sheet (sigue usando los JSON locales).

### 3. Compartir con Laura para editar

En el mismo diálogo: agregar el Gmail de Laura como **Editor**.

### 4. Reiniciar la app

El proyecto ya tiene `.env` con el ID del Sheet. Reiniciá:

```bash
npm start
```

---

## Para Laura (día a día)

1. Abrí el Sheet.
2. Editá solo **es** / **en**.
3. No toques ni borres **key**.
4. Refrescá la web (a veces 10–30 s).

---

## Notas técnicas

- Variables: `REACT_APP_GOOGLE_SHEETS_ID` y `REACT_APP_GOOGLE_SHEETS_TAB` (por defecto `1` = primera pestaña).
- Si la pestaña se llama distinto y falla, en `.env` poné el nombre exacto, ej. `REACT_APP_GOOGLE_SHEETS_TAB=Hoja 1`.
- Alternativa: Apps Script en [`apps-script/Code.gs`](./apps-script/Code.gs) + `REACT_APP_LOCALES_URL`.
- Regenerar CSV: `npm run generate:locales-csv`
