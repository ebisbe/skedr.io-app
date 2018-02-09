<template>
  <v-card>
    <v-card-text style="text-align: center">
      <v-progress-circular
        v-if="requests instanceof Array"
        :size="100"
        :width="15"
        :rotate="360"
        :value="progressToHundred"
        color="teal"
      >
        {{ progress }}
      </v-progress-circular>
      <v-progress-circular
        v-else
        color="teal"
        :size="100"
        :width="4"
        indeterminate/>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  name: 'QPush',
  props: {
    requests: {
      type: [Array, Object],
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

      if (this.requests instanceof Array) {
        this.requests.map(request => this.axios(request).then(() => this.resolvedRequests++))

        Promise.all(this.requests)
          .then(() => {
            this.autoClosePopup()
          })
          .catch(error => this.$emit('error', error))
      } else {
        this.axios(this.requests).then(() => {
          this.resolvedRequests++
          this.autoClosePopup()
        })
      }
    },
    autoClosePopup() {
      setTimeout(() => {
        this.$emit('loaded')
      }, 2000)
    }
  }
}
</script>
