import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import 'vuetify/src/stylus/app.styl'
import { Resize, Ripple } from 'vuetify/es5/directives'
import colors from 'vuetify/es5/util/colors'

Vue.use(Vuetify, {
  directives: { Resize, Ripple },
  theme: {
    primary: colors.deepPurple.base,
    secondary: colors.deepPurple.lighten1,
    accent: colors.orange.darken2,
    error: colors.red.base,
    warning: colors.yellow.base,
    info: colors.blue.base,
    success: colors.green.base
  }
})
