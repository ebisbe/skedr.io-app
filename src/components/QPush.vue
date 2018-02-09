<template>
  <v-card>
    <v-card-text style="text-align: center">
      <v-progress-circular
        :size="100"
        :width="15"
        :rotate="360"
        :value="progressToHundred"
        color="teal"
      >
        {{ progress }}
      </v-progress-circular>
    </v-card-text>
  </v-card>
</template>
<script>
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
      return this.resolvedRequests * 100 / this.requests.length || 0
    }
  },
  created() {
    this.pushPhotosToGroups()
  },
  methods: {
    pushPhotosToGroups() {
      this.$emit('loading')

      this.requests.map(request => this.axios(request).then(() => this.resolvedRequests++))
      Promise.all(this.requests)
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
