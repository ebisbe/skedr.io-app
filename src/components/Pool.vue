<template>
    <b-collapse id="pool" class="pool">
        <b-card>
            <img
                    v-for="photo in $store.state.pool"
                    :key="photo.nsid"
                    class="img-thumbnail mr-2"
                    :src="urlPhoto(photo)"
                    @click="removeFromPool(photo)"
            >
            <span v-if="!$store.state.pool.length">The pool is empty. Add some images.</span>
        </b-card>
    </b-collapse>
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
<style>
    .pool .card-body {
        overflow-x: auto;
        overflow-y: hidden;
        white-space: nowrap;
    }

    .pool img:hover {
        border-color: red;
    }
</style>