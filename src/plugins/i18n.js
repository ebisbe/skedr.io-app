import Vue from 'vue'
import VueI18n from 'vue-i18n'
import messages from '@/lang'

Vue.use(VueI18n)
const defaultLocale = localStorage.getItem('defaultLocale')

export default new VueI18n({
  locale: defaultLocale !== null ? defaultLocale : 'en', // set locale
  fallbackLocale: 'en',
  messages
})
