import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translationES from "./locales/es.json";


i18n
    .use(initReactI18next)
    .init({
        supportedLngs: ["es", "en", "fr", "de", "zh"],
        resources: {
            es: { translation: translationES },
        },
        fallbackLng: "es",
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;

