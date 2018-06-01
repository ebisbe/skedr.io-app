import Vue from 'vue'

require('vuetify/src/stylus/app.styl')

import VApp from 'vuetify/es5/components/VApp'
import Vuetify from 'vuetify/es5/components/Vuetify'
import VNavigationDrawer from 'vuetify/es5/components/VNavigationDrawer'
import VFooter from 'vuetify/es5/components/VFooter'
import VList from 'vuetify/es5/components/VList'
import VBtn from 'vuetify/es5/components/VBtn'
import VIcon from 'vuetify/es5/components/VIcon'
import VGrid from 'vuetify/es5/components/VGrid'
import VToolbar from 'vuetify/es5/components/VToolbar'
import VJumbotron from 'vuetify/es5/components/VJumbotron'
import VParallax from 'vuetify/es5/components/VParallax'
import VCard from 'vuetify/es5/components/VCard'
import VDivider from 'vuetify/es5/components/VDivider'
import VDialog from 'vuetify/es5/components/VDialog'
import VTextField from 'vuetify/es5/components/VTextField'
import VSubheader from 'vuetify/es5/components/VSubheader'
import VCheckbox from 'vuetify/es5/components/VCheckbox'
import VTooltip from 'vuetify/es5/components/VTooltip'
import VProgressLinear from 'vuetify/es5/components/VProgressLinear'
import VProgressCircular from 'vuetify/es5/components/VProgressCircular'
import VAlert from 'vuetify/es5/components/VAlert'
import VForm from 'vuetify/es5/components/VForm'
import VExpansionPanel from 'vuetify/es5/components/VExpansionPanel'
import VAvatar from 'vuetify/es5/components/VAvatar'
import VStepper from 'vuetify/es5/components/VStepper'
import VChip from 'vuetify/es5/components/VChip'
import VBadge from 'vuetify/es5/components/VBadge'

import transitions from 'vuetify/es5/components/transitions'
import directives from 'vuetify/es5/directives'
import colors from 'vuetify/es5/util/colors'

Vue.use(Vuetify, {
  components: {
    VApp,
    VNavigationDrawer,
    VFooter,
    VList,
    VBtn,
    VIcon,
    VGrid,
    VToolbar,
    VJumbotron,
    VCard,
    VDivider,
    VParallax,
    VDialog,
    VTextField,
    VSubheader,
    VCheckbox,
    VTooltip,
    VProgressLinear,
    VAlert,
    VForm,
    VProgressCircular,
    VExpansionPanel,
    VAvatar,
    VStepper,
    VChip,
    VBadge,
    transitions,
    directives
  },
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
