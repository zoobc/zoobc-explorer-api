import i18n from 'i18next'

import config from './config'
import en from './locales/en/translation.json'
import id from './locales/id/translation.json'

const isDevelop = process.env.NODE_ENV === 'development'

i18n.init({
  // we init with resources
  resources: {
    en: {
      translations: en,
    },
    id: {
      translations: id,
    },
  },
  lng: config.app.defaultLang,
  fallbackLng: config.app.defaultLang,

  // have a common namespace used around the full app
  ns: ['translations'],
  defaultNS: 'translations',

  keySeparator: false, // we use content as keys

  debug: isDevelop,

  interpolation: {
    formatSeparator: ',',
  },

  react: {
    wait: true,
  },
})

export default i18n
