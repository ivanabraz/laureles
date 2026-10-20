import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpApi from "i18next-http-backend";

const SHEETS_ID = process.env.REACT_APP_GOOGLE_SHEETS_ID;
const SHEETS_TAB = process.env.REACT_APP_GOOGLE_SHEETS_TAB || "1";
const LOCALES_URL = process.env.REACT_APP_LOCALES_URL;

function unflatten(flat) {
  const root = {};
  Object.keys(flat).forEach((dotted) => {
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

function bundlesFromSheetRows(rows) {
  const esFlat = {};
  const enFlat = {};

  rows.forEach((row) => {
    const key = String(row.key || "").trim();
    if (!key) return;
    esFlat[key] = row.es == null ? "" : String(row.es);
    enFlat[key] = row.en == null ? "" : String(row.en);
  });

  // Match public/locales/*/global.json shape: { global: { ... } }
  return {
    es: { global: unflatten(esFlat) },
    en: { global: unflatten(enFlat) },
  };
}

function applyBundles(data) {
  ["es", "en"].forEach((lng) => {
    const bundle = data?.[lng];
    if (bundle && typeof bundle === "object") {
      // deep + overwrite so Sheet values replace local JSON
      i18n.addResourceBundle(lng, "global", bundle, true, true);
    }
  });
}

async function fetchJson(url) {
  const response = await fetch(url, {
    method: "GET",
    redirect: "follow",
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`Remote locales HTTP ${response.status}`);
  }
  return response.json();
}

async function loadRemoteLocales() {
  try {
    if (LOCALES_URL) {
      const data = await fetchJson(LOCALES_URL);
      if (data?.error) throw new Error(data.error);
      // Apps Script returns { es: { global: {...} }, en: { global: {...} } }
      applyBundles({
        es: data?.es,
        en: data?.en,
      });
    } else if (SHEETS_ID) {
      const url = `https://opensheet.elk.sh/${SHEETS_ID}/${encodeURIComponent(SHEETS_TAB)}`;
      const rows = await fetchJson(url);
      if (!Array.isArray(rows)) {
        throw new Error(
          rows?.error ||
            "Respuesta inválida del Sheet. Revisá que esté compartido como “Cualquiera con el enlace”."
        );
      }
      applyBundles(bundlesFromSheetRows(rows));
    } else {
      return;
    }

    await i18n.changeLanguage(i18n.language);
  } catch (error) {
    console.warn(
      "[i18n] No se pudieron cargar textos remotos; se usan los JSON locales.",
      error
    );
  }
}

i18n
  .use(HttpApi)
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    supportedLngs: ["es", "en", "de"],
    fallbackLng: "es",
    detection: {
      order: ["path", "querystring", "localStorage", "cookie", "navigator"],
      caches: ["localStorage", "cookie"],
    },
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: true,
    },
    backend: {
      loadPath: `${process.env.PUBLIC_URL}/locales/{{lng}}/{{ns}}.json`,
    },
    ns: ["global"],
  })
  .then(() => loadRemoteLocales());

export default i18n;
