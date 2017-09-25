<template>
    <b-media tag="li" class="my-4">
        <b-img slot="aside" :src="url" width="64" alt="placeholder"/>
        <h5 class="mt-0 mb-1" v-html="title"></h5>
        {{ photo.message}}
    </b-media>
</template>
<script>
  import Flickr from 'flickr-sdk/flickr-sdk'
  import { url } from '../mixins/urlPhoto.js'

  export default {
    name: 'ScheduledMedia',
    mixins: [url],
    mounted () {
      let flickr = new Flickr('78ab8d949e94be81d67730224abbcdb1')
      flickr.photos.getInfo({
        photo_id: this.photo.photoId,
        secret: this.photo.secret
      }).then((res) => {
        this.loaded = true
        this.fPhoto = res.body.photo
      }).catch(function (err) {
        console.error('bonk', err)
      })
    },
    props: ['photo'],
    data () {
      return {
        loaded: false,
        size: 's',
        fPhoto: {}
      }
    },
    computed: {
      title () {
        if (this.loaded) {
          return this.fPhoto.title._content
        } else {
          return this.photo.photoId
        }
      },
      url () {
        if (this.loaded) {
          return this.urlPhoto(this.fPhoto)
        }
        return ''
      }
    }
  }
</script>