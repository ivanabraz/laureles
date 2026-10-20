/**
 * Pegá este archivo en: Google Sheet → Extensiones → Apps Script
 *
 * Hoja esperada: primera pestaña, columnas A=key, B=es, C=en (fila 1 = encabezados)
 *
 * Deploy:
 * 1. Implementar → Nueva implementación → Aplicación web
 * 2. Ejecutar como: tu cuenta
 * 3. Quién tiene acceso: Cualquiera
 * 4. Copiá la URL .../exec → REACT_APP_LOCALES_URL en .env
 */

function doGet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  const values = sheet.getDataRange().getValues();
  if (!values.length) {
    return jsonResponse({ es: { global: {} }, en: { global: {} } });
  }

  const header = values[0].map(String);
  const keyIdx = header.indexOf("key");
  const esIdx = header.indexOf("es");
  const enIdx = header.indexOf("en");

  if (keyIdx === -1 || esIdx === -1 || enIdx === -1) {
    return jsonResponse({
      error: "Faltan columnas. Usá encabezados: key, es, en",
    });
  }

  const esFlat = {};
  const enFlat = {};

  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    const key = String(row[keyIdx] || "").trim();
    if (!key) continue;
    esFlat[key] = row[esIdx] == null ? "" : String(row[esIdx]);
    enFlat[key] = row[enIdx] == null ? "" : String(row[enIdx]);
  }

  return jsonResponse({
    es: { global: unflatten(esFlat) },
    en: { global: unflatten(enFlat) },
  });
}

function unflatten(flat) {
  const root = {};
  Object.keys(flat).forEach(function (dotted) {
    const parts = dotted.split(".");
    let cursor = root;
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!cursor[part] || typeof cursor[part] !== "object") {
        cursor[part] = {};
      }
      cursor = cursor[part];
    }
    cursor[parts[parts.length - 1]] = flat[dotted];
  });
  return root;
}

function jsonResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON
  );
}
