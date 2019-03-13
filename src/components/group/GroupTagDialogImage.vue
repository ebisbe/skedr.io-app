
<template>
  <base-photo
    :url="urlQ"
    :lazy-url="urlS"
    :height="75"/>
</template>
<script>
import BasePhoto from '@/components/photo/BasePhoto.vue'

export default {
  components: { BasePhoto },
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
