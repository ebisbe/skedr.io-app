import { config } from '@vue/test-utils'
import Vue from 'vue'

Vue.directive('t', key => key)
const keyI18nPassThrough = key => key

config.mocks['$t'] = keyI18nPassThrough
config.mocks['$i18n'] = { $t: keyI18nPassThrough }
