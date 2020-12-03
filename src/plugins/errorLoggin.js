import Vue from 'vue'
import LogRocket from 'logrocket'
import * as Sentry from '@sentry/vue'

const { VUE_APP_REVISION, VUE_APP_SENTRY } = process.env

Sentry.init({
  Vue: Vue,
  dsn: VUE_APP_SENTRY,
  release: VUE_APP_REVISION ? VUE_APP_REVISION : 'local'
})

LogRocket.init('zye3nm/skedrio-prod', { rootHostname: 'skedr.io' })
Sentry.configureScope(scope => {
  scope.addEventProcessor(async event => {
    event.extra.sessionURL = LogRocket.recordingURL
    return event
  })
})
