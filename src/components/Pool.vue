<template>
    <v-card>
        <v-subheader>Photo pool</v-subheader>
        <span v-if="!$store.state.pool.length">The pool is empty. Add some images.</span>
        <v-container v-else fluid grid-list-sm>
            <v-layout row wrap>
                <v-flex xs4 v-for="photo in $store.state.pool"
                        :key="photo.nsid"
                        @click="removeFromPool(photo)">
                    <v-card>
                        <img class="image"
                             :src="urlPhoto(photo)"
                             alt="lorem" width="100%" height="100%">
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>
    </v-card>
</template>
<script>
  import { url } from '../mixins/urlPhoto.js'

  export default {
    name: 'Pool',
    mixins: [url],
    data () {
      return {
        size: 's'
      }
    },
    methods: {
      removeFromPool (photo) {
        this.$store.commit('removeFromPool', {photo: photo})
      },
      thumbnail (photo) {
        return '<img src="' + this.urlPhoto(photo) + '" alt=' + photo.title + '">'
      }
    }
  }
</script>