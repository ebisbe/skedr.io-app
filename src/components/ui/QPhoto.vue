<template>
  <v-card
    :class="{'pa-3 selected': inPool(photo.photoId)}"
    flat
    class="grey lighten-3 q-photo"
    @mouseover="hover = true"
    @mouseout="hover = false"
    @click.native="!inPool(photo.photoId) ? addToPool(photo) : removeFromPool(photo.photoId)">
    <app-observer v-if="showObserver" @intersect="load"/>
    <v-img
      :height="!inPool(photo.photoId) ? height : height - 32"
      :src="bigImg"
      :lazy-src="photo.url_sq"
      aspect-ratio="1"
      class="grey lighten-2 img"
    >
      <v-layout
        slot="placeholder"
        fill-height
        align-center
        justify-center
        ma-0
      >
        <v-progress-circular indeterminate color="grey lighten-5"/>
      </v-layout>
    </v-img>
    <v-icon
      v-if="inPool(photo.photoId)"
      class="q-checkCircle"
      color="accent">check_circle</v-icon>
    <v-icon
      v-else-if="hover"
      class="q-checkCircle white--text">check_circle</v-icon>
    <v-icon v-else class="q-checkCircle white--text">radio_button_unchecked</v-icon>
    <v-container>
      <v-list two-line dark>
        <v-list-tile>
          <v-list-tile-content>
            <v-list-tile-title v-html="photo.title" />
            <v-list-tile-sub-title style="display:flex">
              <v-tooltip bottom>
                <a
                  slot="activator"
                  :href="photoLink"
                  target="_blank"
                  class="white--text"
                  @click.stop>
                  <v-icon>visibility</v-icon>
                  {{ photo.views }}
                </a>
                <span>Views</span>
              </v-tooltip>
              <v-spacer/>
              <v-tooltip bottom>
                <span slot="activator">
                  <v-icon>perm_media</v-icon>
                  {{ groups.length }}
                </span>
                <span>Groups added</span>
              </v-tooltip>
              <v-spacer/>
              <v-tooltip bottom>
                <span>Favorites</span>
                <span slot="activator">
                  <v-icon v-html="star"/>
                  {{ totalFavs }}
                </span>
              </v-tooltip>
            </v-list-tile-sub-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-tooltip top class="ma-0">
              <v-btn
                slot="activator"
                icon
                flat
                class="mx-1"
                @click.stop="sharePhoto">
                <v-icon>share</v-icon>
              </v-btn>
              <span>Sked <br>'{{ photo.title }}'</span>
            </v-tooltip>
          </v-list-tile-action>
        </v-list-tile>
      </v-list>
    </v-container>
  </v-card>
</template>
<script>
import Flickr from 'flickr-sdk'
import { mapActions, mapGetters } from 'vuex'

const CacheModule = require('cache-service-cache-module')
const cache = new CacheModule({ storage: 'session', defaultExpiration: 900 })
const superagentCache = require('superagent-cache-plugin')(cache)

import AppObserver from '@/components/common/AppObserver'

export default {
  components: { AppObserver },
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
      isVisible: false,
      showObserver: true
    }
  },
  computed: {
    photoLink() {
      return `https://www.flickr.com/photos/${this.userId}/${this.photo.photoId}`
    },
    star() {
      return this.totalFavs > 0 ? 'star' : 'star_border'
    },
    bigImg() {
      if (!this.showObserver) {
        return this.photo.url_m
      } else {
        return ''
      }
    },
    ...mapGetters({
      userId: 'user/userId',
      inPool: 'pool/inPool'
    })
  },
  watch: {
    tag(selectedValue) {
      if (!this.photo.tags.includes(selectedValue) || selectedValue === '') {
        this.removeFromPool(this.photo.photoId)
      } else {
        this.addToPool(this.photo)
      }
    }
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
    load() {
      let flickr = new Flickr(process.env.VUE_APP_FLICKR_KEY)
      flickr.photos
        .getAllContexts({ photo_id: this.photo.photoId })
        .use(superagentCache)
        .then(({ body: { pool = [] } }) => {
          this.groups = pool
        })

      flickr.photos
        .getFavorites({ photo_id: this.photo.photoId })
        .use(superagentCache)
        .then(({ body: { photo: { total = 0 } } }) => {
          this.totalFavs = parseInt(total)
        })

      this.showObserver = false
    }
  }
}
</script>
