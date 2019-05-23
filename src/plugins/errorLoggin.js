import Vue from 'vue'
import LogRocket from 'logrocket'
import * as Sentry from '@sentry/browser'

const { NODE_ENV, VUE_APP_REVISION, VUE_APP_SENTRY } = process.env

if (NODE_ENV === 'production') {
  Sentry.init({
    dsn: VUE_APP_SENTRY,
    release: VUE_APP_REVISION,
    integrations: [
      new Sentry.Integrations.Vue({
        Vue,
        attachProps: true
      }),
      new Sentry.Integrations.RewriteFrames()
    ]
  })

  LogRocket.init('zye3nm/skedrio-prod', { rootHostname: 'skedr.io' })
  Sentry.configureScope(scope => {
    scope.addEventProcessor(async event => {
      event.extra.sessionURL = LogRocket.recordingURL
      return event
    })
  })
}
