<template>
    <v-card @click.native="addToPool()" hover>
        <v-card-media
                height="125px"
                :src="photo.url_m">
            <v-container fill-height fluid pt-2 class="fade">
                <v-layout fill-height>
                    <v-flex xs12 align-end flexbox class="pt-0">
                        <span class="subheading white--text">{{ photo.title }}</span>
                    </v-flex>
                    <div style="position: absolute; bottom: 1px" class="white--text body-2">
                        <a target="_blank" :href="photoLink"
                           style="text-decoration: none;" class="white--text">
                            <v-icon color="white">visibility</v-icon>
                            {{ photo.views }}
                        </a>
                        <span>
                            <v-icon color="white">{{ bookmark }}</v-icon>
                            {{ groups.length }}
                        </span>
                        <span>
                            <v-icon color="white">{{ star }}</v-icon>
                            {{ totalFavs }}
                        </span>
                    </div>
                </v-layout>
            </v-container>
        </v-card-media>
        <v-card-actions class="py-1">
            <v-tooltip top class="ma-0">
                <v-btn color="primary" class="mx-1" slot="activator" flat icon @click="addToPool" :disabled="disabled">
                    <v-icon>add_to_photos</v-icon>
                </v-btn>
                <span>Add to pool</span>
            </v-tooltip>
            <v-tooltip top class="ma-0">
                <v-btn icon flat class="mx-1" slot="activator" @click.stop="sharePhoto" color="primary">
                    <v-icon>share</v-icon>
                </v-btn>
                <span>Sked</span>
            </v-tooltip>
            <v-tooltip top class="ma-0">
                <v-btn color="error" class="mx-1" slot="activator" icon flat @click.stop="removeFromPool"
                       v-show="disabled">
                    <v-icon>delete</v-icon>
                </v-btn>
                <span>Remove from pool</span>
            </v-tooltip>
        </v-card-actions>
    </v-card>
</template>
<script>
  import Flickr from 'flickr-sdk'
  import { mapState, mapGetters } from 'vuex'

  const CacheModule = require('cache-service-cache-module')
  const cache = new CacheModule({storage: 'session', defaultExpiration: 900})
  const superagentCache = require('superagent-cache-plugin')(cache)

  export default {
    name: 'Photo',
    props: {
      photo: Object
    },
    data () {
      return {
        groups: [],
        totalFavs: 0
      }
    },
    created () {
      let flickr = new Flickr(process.env.FLICKR_KEY)
      flickr.photos
        .getAllContexts({photo_id: this.photoId})
        .use(superagentCache)
        .then(response => {
          if (response.body.hasOwnProperty('pool')) {
            this.groups = response.body.pool
          }
        })

      flickr.photos.getFavorites({photo_id: this.photoId})
        .use(superagentCache)
        .then(response => {
          this.totalFavs = parseInt(response.body.photo.total)
        })
    },
    methods: {
      addToPool () {
        this.$store.commit('addToPool', {photo: this.photo, add: true})
      },
      removeFromPool () {
        this.$store.commit('addToPool', {photo: this.photo, add: false})
      },
      sharePhoto () {
        this.$store.commit('showDialog', [this.photo])
      }
    },
    computed: {
      photoLink () {
        return `https://www.flickr.com/photos/${this.userId}/${this.photoId}`
      },
      /** Backwards compaitiblity with view group images */
      photoId () {
        if (this.photo.photoId !== undefined) {
          return this.photo.photoId
        } else {
          return this.photo.id
        }
      },
      /** END - BACKWARDS compatibility */
      bookmark () {
        return this.groups.length > 0 ? 'bookmark' : 'bookmark_border'
      },
      star () {
        return this.totalFavs > 0 ? 'star' : 'star_border'
      },
      disabled () {
        let matches = this.pool.filter(o => {
          return o.id === this.photoId || o.photoId === this.photoId
        })
        return matches.length > 0
      },
      ...mapState(['pool']),
      ...mapGetters(['userId'])
    }
  }
</script>
<style>
    .fade {
        /* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#3a3a3a+0,3a3a3a+100&0.65+0,0.35+18,0+36,0+79,0.35+94,0.65+100 */
        background: -moz-linear-gradient(top, rgba(58, 58, 58, 0.65) 0%, rgba(58, 58, 58, 0.35) 18%, rgba(58, 58, 58, 0) 36%, rgba(58, 58, 58, 0) 79%, rgba(58, 58, 58, 0.35) 94%, rgba(58, 58, 58, 0.65) 100%); /* FF3.6-15 */
        background: -webkit-linear-gradient(top, rgba(58, 58, 58, 0.65) 0%, rgba(58, 58, 58, 0.35) 18%, rgba(58, 58, 58, 0) 36%, rgba(58, 58, 58, 0) 79%, rgba(58, 58, 58, 0.35) 94%, rgba(58, 58, 58, 0.65) 100%); /* Chrome10-25,Safari5.1-6 */
        background: linear-gradient(to bottom, rgba(58, 58, 58, 0.65) 0%, rgba(58, 58, 58, 0.35) 18%, rgba(58, 58, 58, 0) 36%, rgba(58, 58, 58, 0) 79%, rgba(58, 58, 58, 0.35) 94%, rgba(58, 58, 58, 0.65) 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
        filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#a63a3a3a', endColorstr='#a63a3a3a', GradientType=0); /* IE6-9 */
    }
</style>

