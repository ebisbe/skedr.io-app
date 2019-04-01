import Vue from 'vue'
import LogRocket from 'logrocket'
import * as Sentry from '@sentry/browser'

Sentry.init({
  dsn: process.env.VUE_APP_SENTRY,
  integrations: [
    new Sentry.Integrations.Vue({
      Vue,
      attachProps: true
    })
  ]
})

if (process.env.NODE_ENV === 'production') {
  LogRocket.init('zye3nm/skedrio-prod', { rootHostname: 'skedr.io' })
  Sentry.configureScope(scope => {
    scope.addEventProcessor(async event => {
      event.extra.sessionURL = LogRocket.recordingURL
      return event
    })
  })
}
