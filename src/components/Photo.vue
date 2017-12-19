<template>
    <v-card hover>
        <v-card-media
                height="125px"
                :src="photo.url_m">
            <v-container fill-height fluid pt-2 class="fade">
                <v-layout fill-height>
                    <v-flex xs12 align-end flexbox class="pt-0">
                        <span class="subheading white--text">{{ photo.title }}</span>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-card-media>
        <v-card-text style="position: relative" class="pa-0" v-show="false">
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
        <v-card-actions>
            <v-btn color="primary" flat @click="addToPool()" :disabled="disabled">
                <v-icon>add_to_photos</v-icon>&nbsp;add
            </v-btn>
        </v-card-actions>
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
      let flickr = new Flickr(process.env.FLICKR_KEY)
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
<style>
    .fade {
        /* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#3a3a3a+0,000000+100&0.65+0,0.35+18,0+57,0+100 */
        background: -moz-linear-gradient(top, rgba(58,58,58,0.65) 0%, rgba(48,48,48,0.35) 18%, rgba(25,25,25,0) 57%, rgba(0,0,0,0) 100%); /* FF3.6-15 */
        background: -webkit-linear-gradient(top, rgba(58,58,58,0.65) 0%,rgba(48,48,48,0.35) 18%,rgba(25,25,25,0) 57%,rgba(0,0,0,0) 100%); /* Chrome10-25,Safari5.1-6 */
        background: linear-gradient(to bottom, rgba(58,58,58,0.65) 0%,rgba(48,48,48,0.35) 18%,rgba(25,25,25,0) 57%,rgba(0,0,0,0) 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
        filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#a63a3a3a', endColorstr='#00000000',GradientType=0 ); /* IE6-9 */
    }
</style>

