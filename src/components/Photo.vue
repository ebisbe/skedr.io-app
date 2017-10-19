<template>
    <v-card hover>
        <v-card-media
                height="125px"
                :src="photo.url_m"
        >
            <v-container fill-height fluid>
                <v-layout fill-height>
                    <v-flex xs12 align-end flexbox>
                        <span class="subheading white--text">{{ photo.title }}</span>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-card-media>
        <v-card-actions class="white">
            <v-btn fab small class="deep-purple--text"
                   :outline="!disabled" :disabled="disabled"
                   @click="addToPool()">
                <v-icon>add</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn target="_blank" flat icon
                   :href="'https://www.flickr.com/photos/' + photo.owner +'/' + photo.id ">
                {{ photo.views }}
                <v-icon>visibility</v-icon>
            </v-btn>
            <span>
                {{ groups.length }}
                <v-icon>{{ bookmark }}</v-icon>
            </span>
        </v-card-actions>
    </v-card>
</template>
<script>
  import Flickr from 'flickr-sdk'
  import _ from 'lodash'
  import { mapState } from 'vuex'

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
      flickr.photos.getAllContexts({photo_id: this.photo.id})
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
      bookmark () {
        return this.groups.length > 0 ? 'bookmark' : 'bookmark_border'
      },
      disabled () {
        let matches = _.find(this.pool, {'id': this.photo.id})
        return this.selectedGroups > 0 || (this.isDef(matches))
      },
      ...mapState([
        'selectedGroups',
        'pool'
      ])
    }
  }
</script>