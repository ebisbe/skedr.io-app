<template>
    <v-list-tile avatar download>
        <v-list-tile-avatar>
            <img :src="urlPhoto(fPhoto)">
        </v-list-tile-avatar>
        <v-list-tile-content>
            <v-list-tile-title v-html="title"></v-list-tile-title>
            <v-list-tile-sub-title v-html="photo.message"></v-list-tile-sub-title>
        </v-list-tile-content>
        <slot name="action"></slot>
    </v-list-tile>
</template>
<script>
  import Flickr from 'flickr-sdk'
  import { url } from '../mixins/urlPhoto'
  const CacheModule = require('cache-service-cache-module')
  const cache = new CacheModule({storage: 'session', defaultExpiration: 900})
  const superagentCache = require('superagent-cache-plugin')(cache)

  export default {
    name: 'photoList',
    mixins: [url],
    props: {
      photo: Object
    },
    data () {
      return {
        fPhoto: {},
        size: 's'
      }
    },
    created () {
      let flickr = new Flickr('78ab8d949e94be81d67730224abbcdb1')
      flickr.photos.getInfo({photo_id: this.photo.photoId, secret: this.photo.secret})
        .use(superagentCache)
        .then((response) => {
          this.fPhoto = response.body.photo
        })
    },
    computed: {
      title () {
        if (this.fPhoto.hasOwnProperty('title')) {
          return this.fPhoto.title._content
        } else {
          return this.photo.photoId
        }
      }
    }
  }
</script>
