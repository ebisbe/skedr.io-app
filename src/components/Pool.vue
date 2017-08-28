<template>
    <div class="pool border"
         v-if="visible">
        <img
                v-for="photo in $store.state.pool"
                :key="photo.nsid"
                class="img-thumbnail my-2 mx-1"
                :src="urlPhoto(photo)"
                @click="removeFromPool(photo)"
        >
    </div>
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
    },
    computed: {
      visible () {
        return this.$store.state.poolVisible
      }
    }
  }
</script>
<style>
    .pool {
        width: auto;
        overflow-x: scroll;
        overflow-y: hidden;
        white-space: nowrap;
    }

    .pool img:hover {
        border-color: red;
    }
</style>