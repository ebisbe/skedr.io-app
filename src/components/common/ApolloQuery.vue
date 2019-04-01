<template>
  <div>
    <slot :result="result" name="result" />
  </div>
</template>

<script>
import apolloClient from '@/plugins/apolloClient'
import * as Sentry from '@sentry/browser'

export default {
  props: {
    query: {
      type: Object,
      required: true
    },
    variables: {
      type: Object,
      required: true
    },
    options: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      // some default values until query begin
      result: {
        data: null,
        loading: false,
        networkStatus: 7,
        error: null
      }
    }
  },
  watch: {
    variables: {
      deep: true,
      handler: function() {
        this.apolloQuery()
      }
    }
  },
  created() {
    this.apolloQuery()
  },
  methods: {
    apolloQuery(variables = {}, options = {}) {
      this.result.loading = true
      return apolloClient
        .query({
          ...this.options,
          ...options,
          query: this.query,
          variables: {
            ...this.variables,
            ...variables
          }
        })
        .then(result => {
          this.result = result
        })
        .catch(error => {
          this.result.loading = false
          this.result.error = error.message
          Sentry.captureException(error);
        })
    }
  }
}
</script>
