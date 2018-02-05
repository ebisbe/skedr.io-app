<template>
  <v-list-tile
    avatar
    download>
    <v-list-tile-avatar>
      <img :src="urlPhoto(fPhoto)">
    </v-list-tile-avatar>
    <v-list-tile-content>
      <v-list-tile-title v-html="title"/>
      <v-list-tile-sub-title v-html="photo.message"/>
    </v-list-tile-content>
    <slot name="action"/>
  </v-list-tile>
</template>
<script>
import Flickr from 'flickr-sdk'
import { url } from '../mixins/urlPhoto'
const CacheModule = require('cache-service-cache-module')
const cache = new CacheModule({
  storage: 'session',
  defaultExpiration: 60 * 60 * 24
})
const superagentCache = require('superagent-cache-plugin')(cache)

export default {
  name: 'PhotoList',
  mixins: [url],
  props: {
    photo: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      fPhoto: {},
      size: 's'
    }
  },
  computed: {
    title() {
      if (this.fPhoto.hasOwnProperty('title')) {
        return this.fPhoto.title._content
      } else {
        return this.photo.photoId
      }
    }
  },
  created() {
    let flickr = new Flickr(process.env.FLICKR_KEY)
    flickr.photos
      .getInfo({ photo_id: this.photo.photoId, secret: this.photo.secret })
      .use(superagentCache)
      .then(response => {
        this.fPhoto = response.body.photo
      })
  }
}
</script>
