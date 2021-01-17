import Vue from 'vue'
import LogRocket from 'logrocket'
import * as Sentry from '@sentry/vue'

const isProd = process.env.NODE_ENV === 'production'
const { VUE_APP_REVISION, VUE_APP_SENTRY } = process.env

if (isProd) {
  Sentry.init({
    Vue: Vue,
    dsn: VUE_APP_SENTRY,
    release: VUE_APP_REVISION ? VUE_APP_REVISION : 'local'
  })

  LogRocket.init('zye3nm/skedrio-prod', { rootHostname: 'skedr.io' })
  LogRocket.getSessionURL(sessionURL => {
    Sentry.configureScope(scope => {
      scope.setExtra('sessionURL', sessionURL)
    })
  })
}
