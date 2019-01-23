
<template>
  <v-img
    :src="urlQ"
    :lazy-src="urlS"
    height="75px"
  >
    <v-layout
      slot="placeholder"
      fill-height
      align-center
      justify-center
      ma-0
    >
      <v-progress-circular indeterminate color="primary"/>
    </v-layout>
  </v-img>
</template>
<script>
export default {
  props: {
    photoId: {
      type: String,
      required: true
    },
    secret: {
      type: String,
      required: true
    },
    farm: {
      type: Number,
      required: true
    },
    server: {
      type: Number,
      required: true
    }
  },
  computed: {
    urlQ() {
      return this.url('q')
    },
    urlS() {
      return this.url()
    }
  },
  methods: {
    url(size = 's') {
      return `https://farm${this.farm}.staticflickr.com/${this.server}/${this.photoId}_${this.secret}_${size}.jpg`
    }
  }
}
</script>
