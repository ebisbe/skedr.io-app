<template>
  <base-photo
    :height="height"
    :url="url"
    :lazy-url="url_sq"
    :is-private="!photo.photo.isPublic">
    <template v-slot:footer>
      <footer-photo :title="photo.photo.title" />
    </template>
  </base-photo>
</template>
<script>
import BasePhoto from './BasePhoto.vue'
import FooterPhoto from './FooterPhoto.vue'

export default {
  components: { BasePhoto, FooterPhoto },
  props: {
    photo: {
      type: Object,
      required: true
    },
    height: {
      type: Number,
      required: false,
      default: 205
    }
  },
  computed: {
    url() {
      return this.composeUrl()
    },
    url_sq() {
      return this.composeUrl('_sq')
    }
  },
  methods: {
    composeUrl(size = '') {
      const {
        photoId,
        photo: { server, farm, secret }
      } = this.photo
      return `https://farm${farm}.staticflickr.com/${server}/${photoId}_${secret}${size}.jpg`
    }
  }
}
</script>
