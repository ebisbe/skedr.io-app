<template>
  <v-card
    flat
    class="sked-photo">
    <v-card-media
      :src="url"
      height="205px"/>
    <v-container>
      <v-list two-line dark>
        <v-list-tile>
          <v-list-tile-content>
            <v-list-tile-title v-html="photo.photo.title" />
            <v-list-tile-sub-title v-html="photo.message" />
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-container>
  </v-card>
</template>
<script>
export default {
  name: 'PhotoScheduled',
  props: {
    photo: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isVisible: false
    }
  },
  computed: {
    url() {
      const { photoId, secret, photo } = this.photo
      const { server, farm } = photo
      return `https://farm${farm}.staticflickr.com/${server}/${photoId}_${secret}.jpg`
    }
  }
}
</script>
