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
          <v-list-tile-sub-title style="display:flex;">
            <v-layout
              align-center
              class="pl-1 my-1"
            >
              <v-tooltip bottom lazy>
                <a
                  slot="activator"
                  :href="photoLink"
                  target="_blank"
                  class="white--text"
                  @click.stop>
                  <v-icon class="mr-1">visibility</v-icon>
                  <span class="subheading mr-2 font-weight-bold" v-html="photo.views"/>
                </a>
                <span v-t="'Layout.views'"/>
              </v-tooltip>
              <span class="mr-1">·</span>
              <v-tooltip bottom lazy>
                <span slot="activator">
                  <v-icon class="mr-1">perm_media</v-icon>
                  <span class="subheading font-weight-bold" v-html="photo.sharedGroups"/>
                </span>
                <span v-t="'Layout.groups_added'"/>
              </v-tooltip>
              <span class="mr-1">·</span>
              <v-tooltip bottom lazy>
                <span slot="activator">
                  <v-icon class="mr-1" v-html="star"/>
                  <span class="subheading font-weight-bold" v-html="photo.totalFavs"/>
                </span>
                <span v-t="'Layout.favorites'"/>
              </v-tooltip>
            </v-layout>
          </v-list-tile-sub-title>
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
