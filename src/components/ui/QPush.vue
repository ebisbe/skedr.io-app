<template>
  <v-card>
    <v-card-text style="text-align: center">
      <v-progress-circular
        v-if="requests.length > 1"
        :size="100"
        :width="4"
        :value="progressToHundred"
        color="accent">
        {{ progress }}
      </v-progress-circular>
      <v-progress-circular
        v-else
        :size="100"
        :width="4"
        color="accent"
        indeterminate/>
    </v-card-text>
  </v-card>
</template>
<script>
import API  from '@aws-amplify/api'

export default {
  props: {
    requests: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      resolvedRequests: 0
    }
  },
  computed: {
    progress() {
      return this.resolvedRequests + ' / ' + this.requests.length
    },
    progressToHundred() {
      return (this.resolvedRequests * 100) / this.requests.length || 0
    }
  },
  created() {
    this.$emit('loading')

    const requestsArr = this.requests.map(request =>
      API.post(process.env.VUE_APP_API_NAME, request.path, request.payload)
        .then(() => this.resolvedRequests++)
        .catch(error => error)
    )

    Promise.all(requestsArr)
      .then(() => {
        setTimeout(() => {
          this.$emit('loaded')
        }, 2000)
      })
      .catch(error => this.$emit('error', error))
  }
}
</script>
