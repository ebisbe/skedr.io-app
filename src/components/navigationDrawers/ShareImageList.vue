<template>
  <v-list-tile avatar>
    <v-list-tile-avatar>
      <v-badge
        v-model="isPrivate"
        overlap
        color="black">
        <template v-slot:badge>
          <v-icon
            dark
            small
            color="warning">lock</v-icon>
        </template>
        <img :src="photo.urlSq">
      </v-badge>
    </v-list-tile-avatar>
    <v-list-tile-content>
      <v-list-tile-title>{{ photo.title }}</v-list-tile-title>
    </v-list-tile-content>
    <v-list-tile-action>
      <v-btn
        icon
        ripple
        @click.native.stop="remove(photo.photoId)">
        <v-icon>close</v-icon>
      </v-btn>
    </v-list-tile-action>
  </v-list-tile>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  props: {
    photo: {
      type: Object,
      required: true
    }
  },
  computed: {
    isPrivate() {
      return !this.photo.isPublic
    }
  },
  methods: {
    ...mapActions({
      remove: 'pool/remove'
    })
  }
}
</script>
