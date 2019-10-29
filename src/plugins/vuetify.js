import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import { Resize, Ripple } from 'vuetify/es5/directives'
import colors from 'vuetify/es5/util/colors'
import '@mdi/font/css/materialdesignicons.css'

const opts = {
  directives: { Resize, Ripple },
  theme: {
    themes: {
      light: {
        primary: colors.deepPurple.base,
        secondary: colors.deepPurple.lighten1,
        accent: colors.orange.darken2,
        error: colors.red.base,
        warning: colors.yellow.base,
        info: colors.blue.base,
        success: colors.green.base
      }
    }
  }
}
Vue.use(Vuetify)

export default new Vuetify(opts)
