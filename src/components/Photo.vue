<template>
  <v-card
    :height="`${height}px`"
    flat
    v-observe-visibility="visibilityChanged"
    class="grey lighten-3 sked-photo"
    @mouseover="hover = true"
    @mouseout="hover = false"
    @click.native="!inPool(photo.photoId) ? addToPool(photo) : removeFromPool(photo.photoId)"
    :class="{'pa-3': inPool(photo.photoId)}">
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
    <v-container>
      <v-list
        two-line
        dark
        class="list pa-0">
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
              <span>Sked pool</span>
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
        console.log(isVisible, this.isVisible)
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
<style>
.sked-checkCircle {
  position: absolute;
  top: 8px;
  left: 8px;
}
.sked-photo:hover {
  cursor: pointer;
}
.sked-photo .container {
  position: absolute;
  bottom: 0;
  left: 0;
  padding: inherit;
}
.sked-photo .container .list {
  background-color: rgba(66, 66, 66, 0.5);
}
.sked-photo .container .list .white--text {
  text-decoration: none;
}
.sked-photo .blur {
  -webkit-filter: blur(5px);
  -moz-filter: blur(5px);
  -ms-filter: blur(5px);
  -o-filter: blur(5px);
  filter: blur(5px);
}
.sked-photo .blur.loaded {
  -webkit-transition: all 0.5s linear;
  -moz-transition: all 0.5s linear;
  -ms-transition: all 0.5s linear;
  -o-transition: all 0.5s linear;
  transition: all 0.5s linear;

  -webkit-filter: blur(0px);
  -moz-filter: blur(0px);
  -ms-filter: blur(0px);
  -o-filter: blur(0px);
  filter: blur(0px);
}
.fade {
  /* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#3a3a3a+0,3a3a3a+100&0.65+0,0.35+18,0+36,0+79,0.35+94,0.65+100 */
  background: -moz-linear-gradient(
    top,
    rgba(58, 58, 58, 0.65) 0%,
    rgba(58, 58, 58, 0.35) 18%,
    rgba(58, 58, 58, 0) 36%,
    rgba(58, 58, 58, 0) 79%,
    rgba(58, 58, 58, 0.35) 94%,
    rgba(58, 58, 58, 0.65) 100%
  ); /* FF3.6-15 */
  background: -webkit-linear-gradient(
    top,
    rgba(58, 58, 58, 0.65) 0%,
    rgba(58, 58, 58, 0.35) 18%,
    rgba(58, 58, 58, 0) 36%,
    rgba(58, 58, 58, 0) 79%,
    rgba(58, 58, 58, 0.35) 94%,
    rgba(58, 58, 58, 0.65) 100%
  ); /* Chrome10-25,Safari5.1-6 */
  background: linear-gradient(
    to bottom,
    rgba(58, 58, 58, 0.65) 0%,
    rgba(58, 58, 58, 0.35) 18%,
    rgba(58, 58, 58, 0) 36%,
    rgba(58, 58, 58, 0) 79%,
    rgba(58, 58, 58, 0.35) 94%,
    rgba(58, 58, 58, 0.65) 100%
  ); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#a63a3a3a', endColorstr='#a63a3a3a', GradientType=0); /* IE6-9 */
}
</style>
