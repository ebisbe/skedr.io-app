<template>
  <base-photo
    :height="realHeight"
    :url="bigImg"
    :lazy-url="photo.urlSq"
    :is-private="!photo.isPublic"
    :class="{'pa-3 selected': isPhotoInPool}"
    class="photostream"
    @mouseover="hover = true"
    @mouseleave="hover = false"
    @click.native="!isPhotoInPool ? addToPool(photo) : removeFromPool(photo.id)"
  >
    <template v-slot:header>
      <app-observer v-if="showObserver" @intersect="showObserver = false"/>
    </template>
    <template v-slot:footer>
      <v-icon
        v-if="isPhotoInPool"
        class="checkCircle"
        color="accent">check_circle</v-icon>
      <v-icon
        v-else-if="hover"
        class="checkCircle white--text">check_circle</v-icon>
      <v-icon v-else class="checkCircle white--text">radio_button_unchecked</v-icon>
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
                <span>Views</span>
              </v-tooltip>
              <span class="mr-1">·</span>
              <v-tooltip bottom lazy>
                <span slot="activator">
                  <v-icon class="mr-1">perm_media</v-icon>
                  <span class="subheading font-weight-bold" v-html="photo.sharedGroups"/>
                </span>
                <span>Groups added</span>
              </v-tooltip>
              <span class="mr-1">·</span>
              <v-tooltip bottom lazy>
                <span slot="activator">
                  <v-icon class="mr-1" v-html="star"/>
                  <span class="subheading font-weight-bold" v-html="photo.totalFavs"/>
                </span>
                <span>Favorites</span>
              </v-tooltip>
            </v-layout>
          </v-list-tile-sub-title>
        </template>
        <template v-slot:action>
          <v-list-tile-action>
            <v-tooltip
              top
              lazy>
              <v-btn
                slot="activator"
                flat
                class="mx-1"
                icon
                @click.stop="share({ photos: [photo] })">
                <v-icon>share</v-icon>
              </v-btn>
              <span>Sked image</span>
            </v-tooltip>
          </v-list-tile-action>
        </template>
      </footer-photo>
    </template>
  </base-photo>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import AppObserver from '@/components/common/AppObserver.vue'
import BasePhoto from '@/components/photo/BasePhoto.vue'
import FooterPhoto from '@/components/photo/FooterPhoto.vue'

export default {
  components: { AppObserver, BasePhoto, FooterPhoto },
  props: {
    photo: {
      type: Object,
      required: true
    },
    height: {
      type: Number,
      default: 205
    }
  },
  data() {
    return {
      hover: false,
      showObserver: true
    }
  },
  computed: {
    photoLink() {
      return `https://www.flickr.com/photos/${this.userId}/${this.photo.id}`
    },
    star() {
      return this.photo.totalFavs > 0 ? 'star' : 'star_border'
    },
    bigImg() {
      return !this.showObserver ? this.photo.urlM : ''
    },
    isPhotoInPool() {
      return this.inPool(this.photo.id)
    },
    realHeight() {
      return !this.isPhotoInPool ? this.height : this.height - 32
    },
    ...mapGetters({
      userId: 'user/userId',
      inPool: 'pool/inPool'
    })
  },
  methods: {
    ...mapActions({
      addToPool: 'pool/add',
      removeFromPool: 'pool/remove',
      share: 'sharedPool/share'
    })
  }
}
</script>

<style scoped>
.checkCircle {
  position: absolute;
  top: 8px;
  left: 8px;
}

.photostream {
  padding: 0;
  transition: padding 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.photostream :hover {
  cursor: pointer;
}

.footer .v-list .white--text {
  text-decoration: none;
}
</style>
