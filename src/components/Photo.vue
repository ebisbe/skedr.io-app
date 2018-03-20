<template>
  <v-card
    flat
    v-observe-visibility="visibilityChanged"
    class="grey lighten-3 sked-photo"
    @mouseover="hover = true"
    @mouseout="hover = false"
    @click.native="!inPool(photo.photoId) ? addToPool(photo) : removeFromPool(photo.photoId)"
    :class="{'pa-3': inPool(photo.photoId), 'selected': inPool(photo.photoId)}">
    <v-card-media
      :class="{'blur':true, 'loaded': isVisible}"
      :height="!inPool(photo.photoId) ? `${height}px` : `${height - 32}px`"
      :src="photo.url_m"/>
    <v-icon
      v-if="inPool(photo.photoId)"
      class="sked-checkCircle"
      color="info">check_circle</v-icon>
    <v-icon
      v-else-if="hover"
      class="sked-checkCircle white--text">check_circle</v-icon>
    <v-icon v-else class="sked-checkCircle white--text">radio_button_unchecked</v-icon>
    <v-list two-line dark>
      <v-list-tile>
        <v-list-tile-content>
          <v-list-tile-title v-html="photo.title" />
          <v-list-tile-sub-title>
            <a
              target="_blank"
              :href="photoLink"
              @click.stop
              class="white--text">
              <v-icon>visibility</v-icon>
              {{ photo.views }}
            </a>
            <span>
              <v-icon v-html="bookmark"/>
              {{ groups.length }}
            </span>
            <span>
              <v-icon v-html="star"/>
              {{ totalFavs }}
            </span>
          </v-list-tile-sub-title>
        </v-list-tile-content>
        <v-list-tile-action>
          <v-tooltip top class="ma-0">
            <v-btn
              icon
              flat
              class="mx-1"
              slot="activator"
              @click.stop="sharePhoto">
              <v-icon>share</v-icon>
            </v-btn>
            <span>Sked <br>'{{ photo.title }}'</span>
          </v-tooltip>
        </v-list-tile-action>
      </v-list-tile>
    </v-list>
  </v-card>
</template>
<script>
import Flickr from 'flickr-sdk'
import { mapActions, mapGetters } from 'vuex'

const CacheModule = require('cache-service-cache-module')
const cache = new CacheModule({ storage: 'session', defaultExpiration: 900 })
const superagentCache = require('superagent-cache-plugin')(cache)

export default {
  name: 'Photo',
  props: {
    photo: {
      type: Object,
      required: true
    },
    tag: {
      type: String,
      default: ''
    },
    height: {
      type: Number,
      default: 205
    }
  },
  data() {
    return {
      groups: [],
      totalFavs: 0,
      hover: false,
      isVisible: false
    }
  },
  computed: {
    photoLink() {
      return `https://www.flickr.com/photos/${this.userId}/${this.photo.photoId}`
    },
    bookmark() {
      return this.groups.length > 0 ? 'bookmark' : 'bookmark_border'
    },
    star() {
      return this.totalFavs > 0 ? 'star' : 'star_border'
    },
    ...mapGetters(['userId']),
    ...mapGetters({
      inPool: 'pool/inPool'
    })
  },
  methods: {
    ...mapActions({
      addToPool: 'pool/add',
      removeFromPool: 'pool/remove',
      share: 'sharedPool/share'
    }),
    sharePhoto() {
      this.share({ photos: [this.photo], selectedGroups: this.groups })
    },
    visibilityChanged(isVisible, entry) {
      if (this.isVisible === false && isVisible) {
        this.isVisible = true
        this.loadComponent()
      }
    },
    loadComponent() {
      let flickr = new Flickr(process.env.FLICKR_KEY)
      flickr.photos
        .getAllContexts({ photo_id: this.photo.photoId })
        .use(superagentCache)
        .then(response => {
          if (response.body.hasOwnProperty('pool')) {
            this.groups = response.body.pool
          }
        })

      flickr.photos
        .getFavorites({ photo_id: this.photo.photoId })
        .use(superagentCache)
        .then(response => {
          this.totalFavs = parseInt(response.body.photo.total)
        })
    }
  }
}
</script>
