<template>
  <base-photo
    :url="urlQ"
    :external-link="`https://www.flickr.com/photos/${userId}/${photoId}`"
    :lazy-url="urlS"
    :height="75"
  />
</template>
<script>
  import BasePhoto from '@/components/photo/BasePhoto.vue'
  import { mapGetters } from 'vuex'

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
      ...mapGetters({
        userId: 'user/userId'
      }),
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
