<template>
    <b-card :footer="photo.title"
            :img-src="urlPhoto(photo)"
            img-alt="photo.title"
            no-body
            img-top
            :bg-variant="variant"
            @click="choosePhoto()"
            footer-tag="footer"
            class="mb-2">
    </b-card>
</template>
<script>
  import { urlPhoto } from '../mixins/urlPhoto.js'

  export default {
    name: 'Photo',
    mixins: [urlPhoto],
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