import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import XHR from 'i18next-http-backend';

import languageEN from './locale/en/translation.json';
import languageCN from './locale/cn/translation.json';
import languageFR from './locale/fr/translation.json';

i18n
  .use(XHR)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: languageEN,
      cn: languageCN,
      fr: languageFR,
    },
    /*default language*/
    /* lng: 'en', */
    /*fallback language*/
    debug: true,
    ns: ['translations'],
    defaultNS: 'translation',
    keySeparator: '.',
    interpolation: {
      escapeValue: false,
      formatSeparator: ',',
    },
    react: {
      bindI18n: 'languageChanged loaded',
      bindI18nStore: 'added removed',
      nsMode: 'default',
    },
    detection: {
      // order and from where user language should be detected
      order: [
        'cookie',
        'localStorage',
        'querystring',
        'sessionStorage',
        'navigator',
        'htmlTag',
        'path',
        'subdomain',
      ],

      // keys or params to lookup language from
      lookupQuerystring: 'lng',
      lookupCookie: 'i18next',
      lookupLocalStorage: 'i18nextLng',
      lookupSessionStorage: 'i18nextLng',
      lookupFromPathIndex: 0,
      lookupFromSubdomainIndex: 0,

      // cache user language on
      caches: ['localStorage', 'cookie'],
      excludeCacheFor: ['cimode'], // languages to not persist (cookie, localStorage)

      // optional expire and domain for set cookie
      cookieMinutes: 10,

      // optional htmlTag with lang attribute, the default is:
      htmlTag: document.documentElement,

      // optional set cookie options, reference:[MDN Set-Cookie docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie)
      cookieOptions: { path: '/', sameSite: 'strict' },
    },
  });

export default i18n;

/**
 * Fixed language detection with tips from:
 * https://stackoverflow.com/questions/54514834/i18next-browser-languagedetector-path-not-working
 */
