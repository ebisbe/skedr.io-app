<template>
    <v-card hover>
        <v-card-media
                height="125px"
                :src="photo.url_m">
            <v-container fill-height fluid>
                <v-layout fill-height>
                    <v-flex xs12 align-end flexbox class="pt-0">
                        <span class="subheading white--text">{{ photo.title }}</span>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-card-media>
        <v-card-text style="position: relative" class="pa-0">
            <v-fab-transition>
                <v-btn dark small fab absolute top right class="deep-purple"
                       v-show="!disabled"
                       @click="addToPool()">
                    <v-icon>add</v-icon>
                </v-btn>
            </v-fab-transition>
            <v-btn target="_blank" flat icon
                   :href="'https://www.flickr.com/photos/' + photo.owner +'/' + photo.id ">
                {{ photo.views }}
                <v-icon>visibility</v-icon>
            </v-btn>
            <span>
                {{ groups.length }}
                <v-icon>{{ bookmark }}</v-icon>
            </span>
        </v-card-text>
    </v-card>
</template>
<script>
  import Flickr from 'flickr-sdk'
  import _ from 'lodash'
  import { mapState } from 'vuex'
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
        groups: []
      }
    },
    created () {
      let flickr = new Flickr('78ab8d949e94be81d67730224abbcdb1')
      flickr.photos.getAllContexts({photo_id: this.photoId})
        .use(superagentCache)
        .then((response) => {
          if (response.body.hasOwnProperty('pool')) {
            this.groups = response.body.pool
          }
        })
    },
    methods: {
      addToPool () {
        this.$store.commit('addToPool', {photo: this.photo, add: true})
      }
    },
    computed: {
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
      disabled () {
        let matches = _.find(this.pool, {'id': this.photo.id})
        return this.selectedGroups.length > 0 || (matches !== undefined)
      },
      ...mapState([
        'selectedGroups',
        'pool'
      ])
    }
  }
</script>
<style media="screen">
  .btn--floating.btn--absolute, .btn--floating.btn--fixed{
    z-index: 2 !important;
  }
</style>
