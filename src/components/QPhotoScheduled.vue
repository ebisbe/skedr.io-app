<template>
  <v-card
    flat
    class="sked-photo">
    <v-card-media
      :src="url"
      :height="`${height}px`"/>
    <v-container>
      <v-list two-line dark>
        <v-list-tile>
          <v-list-tile-content>
            <v-list-tile-title v-html="title" />
            <v-list-tile-sub-title v-html="photo.message" />
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-container>
  </v-card>
</template>
<script>
export default {
  name: 'QPhotoScheduled',
  props: {
    photo: {
      type: Object,
      required: true
    },
    height: {
      type: Number,
      required: false,
      default: 205
    }
  },
  computed: {
    url() {
      if (
        this.photo.hasOwnProperty('photoId') &&
        this.photo.hasOwnProperty('secret') &&
        this.photo.hasOwnProperty('photo') &&
        this.photo.photo.hasOwnProperty('server') &&
        this.photo.photo.hasOwnProperty('farm')
      ) {
        const {
          photoId,
          secret,
          photo: { server, farm }
        } = this.photo
        return `https://farm${farm}.staticflickr.com/${server}/${photoId}_${secret}.jpg`
      } else {
        return 'https://fakeurl.com'
      }
    },
    title() {
      if (this.photo.hasOwnProperty('photo') && this.photo.photo.hasOwnProperty('title')) {
        return this.photo.photo.title
      } else {
        return 'Error loading image'
      }
    }
  }
}
</script>
