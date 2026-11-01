import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import hero from "../data/hero.json";
import about from "../data/about.json";
import portfolio from "../data/portfolio.json";
import contact from "../data/contact.json";
import promo from "../data/promo.json";
import nav from "../data/nav.json";

function copyFor(file, lang) {
  const copy = file && file.copy;
  const locale = copy && copy[lang];
  return locale && typeof locale === "object" ? locale : {};
}

function bundle(lang) {
  return {
    global: {
      ...copyFor(nav, lang),
      ...copyFor(hero, lang),
      ...copyFor(about, lang),
      ...copyFor(portfolio, lang),
      ...copyFor(contact, lang),
      ...copyFor(promo, lang),
    },
  };
}

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources: {
      es: { global: bundle("es") },
      en: { global: bundle("en") },
    },
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
    ns: ["global"],
  });

export default i18n;
