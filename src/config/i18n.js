import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpApi from 'i18next-http-backend';

i18n
.use(HttpApi)
.use(initReactI18next)
.use(LanguageDetector)
.init({
	supportedLngs: ['es', 'en', 'de'],
	fallbackLng: "es",
	detection: {
	order: ['path', 'querystring', 'localStorage', 'cookie', 'navigator'],
	caches: ['localStorage', 'cookie'],
	},
	debug: false,
	interpolation: {
	escapeValue: false,
	},
	react: {
	useSuspense: true
	},
	backend: {
	loadPath: `${process.env.PUBLIC_URL}/locales/{{lng}}/{{ns}}.json`,
	},
	ns: ['global']
});

export default i18n;
