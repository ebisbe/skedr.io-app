<template>
  <v-card style="margin-bottom: 56px">
    <v-card-text style="text-align: center">
      <v-progress-circular
        v-if="requests instanceof Array"
        :size="100"
        :width="15"
        :rotate="360"
        :value="progressToHundred"
        color="teal">
        {{ progress }}
      </v-progress-circular>
      <v-progress-circular
        v-else
        :size="100"
        :width="4"
        color="teal"
        indeterminate/>
    </v-card-text>
  </v-card>
</template>
<script>
import { API } from 'aws-amplify'

export default {
  name: 'QPush',
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
      return `${this.resolvedRequests} / ${this.requests.length}`
    },
    progressToHundred() {
      return (this.resolvedRequests * 100) / this.requests.length || 0
    }
  },
  created() {
    this.pushPhotosToGroups()
  },
  methods: {
    pushPhotosToGroups() {
      this.$emit('loading')

      const requestsArr = this.requests.map(request =>
        API.post(process.env.VUE_APP_API_NAME, request.path, request.payload)
          .then(() => this.resolvedRequests++)
          .catch(error => console.log(error))
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
}
</script>
