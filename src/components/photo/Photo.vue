<template>
  <base-photo
    :url="photo.urlM"
    :lazy-url="photo.urlSq"
    :is-private="!photo.isPublic"
    :class="{'pa-3 selected': isPhotoInPool}"
    :selectable="true"
    :is-selected="isPhotoInPool"
    :is-user-selecting="poolhasItems"
    @click.native="!isPhotoInPool ? add(payload) : remove(payload.id)"
  >
    <template v-slot:footer>
      <footer-photo :title="photo.title">
        <template v-slot:subtitle>
          <v-list-item-subtitle style="display:flex;" class="white--text">
            <v-layout
              align-center
              class="pl-1 my-1"
            >
              <v-tooltip bottom >
                <template v-slot:activator="{on}">
                  <a
                    :href="photoLink"
                    target="_blank"
                    class="white--text"
                    v-on="on"
                    @click.stop>
                    <v-icon class="mr-1" color="white">visibility</v-icon>
                    <span class="subtitle-1 mr-2 font-weight-bold" v-html="photo.views"/>
                  </a>
                </template>
                <span v-t="'Layout.views'"/>
              </v-tooltip>
              <span class="mr-1">·</span>
              <v-tooltip bottom >
                <template v-slot:activator="{ on }">
                  <span v-on="on">
                    <v-icon class="mr-1" color="white">perm_media</v-icon>
                    <span class="subtitle-1 font-weight-bold" v-html="photo.sharedGroups"/>
                  </span>
                </template>
                <span v-t="'Layout.groups_added'"/>
              </v-tooltip>
              <span class="mr-1">·</span>
              <v-tooltip bottom >
                <template v-slot:activator="{ on }">
                  <span v-on="on">
                    <v-icon
                      class="mr-1"
                      color="white"
                      v-html="star"/>
                    <span class="subtitle-1 font-weight-bold" v-html="photo.totalFavs"/>
                  </span>
                </template>
                <span v-t="'Layout.favorites'"/>
              </v-tooltip>
            </v-layout>
          </v-list-item-subtitle>
        </template>
      </footer-photo>
    </template>
  </base-photo>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
import BasePhoto from '@/components/photo/BasePhoto.vue'
import FooterPhoto from '@/components/photo/FooterPhoto.vue'

export default {
  components: { BasePhoto, FooterPhoto },
  props: {
    photo: {
      type: Object,
      required: true
    }
  },
  computed: {
    photoLink() {
      return `https://www.flickr.com/photos/${this.userId}/${this.photo.id}`
    },
    star() {
      return this.photo.totalFavs > 0 ? 'star' : 'star_border'
    },
    isPhotoInPool() {
      return this.inPool(this.photo.id)
    },
    payload() {
      return {
        id: this.photo.id,
        item: this.photo
      }
    },
    ...mapGetters({
      userId: 'user/userId',
      inPool: 'pool/inPool',
      poolhasItems: 'pool/hasItems'
    })
  },
  methods: {
    ...mapMutations({
      add: 'pool/add',
      remove: 'pool/remove'
    })
  }
}
</script>

<style scoped>
.footer .v-list .white--text {
  text-decoration: none;
}
</style>
