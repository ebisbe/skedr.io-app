<template>
    <v-card :footer="photo.title"
            class="mb-2">
        <img :src="urlPhoto(photo)" alt="">
    </v-card>
</template>
<script>
  import { url } from '../mixins/urlPhoto.js'

  export default {
    name: 'Photo',
    mixins: [url],
    props: {
      photo: Object,
      size: String,
      selectable: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        selected: false
      }
    },
    methods: {
      choosePhoto () {
        if (this.selectable) {
          this.selected = this.selected !== true
          this.$emit('selected', this.photo, this.selected)
        }
      }
    },
    computed: {
      classAtt () {
        return 'image filtered ' + this.classSpan
      },
      variant () {
        return this.selected ? 'success' : ''
      }
    }
  }
</script>