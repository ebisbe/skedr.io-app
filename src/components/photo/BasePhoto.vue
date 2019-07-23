<template>
  <v-sheet
    v-bind="$attrs"
    :class="{'photostream': selectable, 'unselectable': !selectable}"
    class="grey lighten-2"
    @mouseover="selectable ? hover = true : null"
    @mouseleave="hover = false"
    v-on="$listeners">
    <app-observer v-if="showObserver" @intersect="showObserver = false"/>
    <slot name="header"/>
    <external-link-badge
      :hover="hover && externalLink !== '' ? true : false"
      :href="externalLink"
      style="display:block !important;">
      <v-img
        :height="realHeight"
        :src="bigImg"
        :lazy-src="lazyUrl"
        aspect-ratio="1"
        class="img">
        <v-layout
          slot="placeholder"
          fill-height
          align-center
          justify-center
          ma-0>
          <v-progress-circular indeterminate color="grey lighten-5"/>
        </v-layout>
      </v-img>
    </external-link-badge>
    <v-tooltip
      v-if="isPrivate"
      class="non-public"
      lazy
      left>
      <v-icon
        slot="activator"
        large
        class="warning--text">lock</v-icon>
      <span v-t="'Layout.private_image'"/>
    </v-tooltip>
    <v-icon
      v-if="isSelected"
      class="checkCircle"
      color="accent">check_circle</v-icon>
    <v-icon
      v-else-if="hover"
      class="checkCircle white--text">check_circle</v-icon>
    <v-icon v-else-if="isUserSelecting" class="checkCircle white--text">radio_button_unchecked</v-icon>
    <slot name="footer"/>
  </v-sheet>
</template>
<script>
import ExternalLinkBadge from '@/components/common/ExternalLinkBadge'
import AppObserver from '@/components/common/AppObserver.vue'

export default {
  components: { ExternalLinkBadge, AppObserver },
  props: {
    height: {
      type: Number,
      default: 250
    },
    url: {
      type: String,
      required: true
    },
    lazyUrl: {
      type: String,
      required: true
    },
    isPrivate: {
      type: Boolean,
      default: false
    },
    externalLink: {
      type: String,
      default: ''
    },
    selectable: {
      type: Boolean,
      default: false
    },
    isSelected: {
      type: Boolean,
      default: false
    },
    isUserSelecting: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({ hover: false, showObserver: true }),
  computed: {
    bigImg() {
      return !this.showObserver ? this.url : ''
    },
    realHeight() {
      return !this.isSelected ? this.height : this.height - 32
    }
  }
}
</script>
<style scoped>
.img {
  border-bottom-left-radius: 2px;
  border-bottom-right-radius: 2px;
  transition: height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.checkCircle {
  position: absolute;
  top: 8px;
  left: 8px;
}

.non-public {
  position: absolute;
  top: 8px;
  right: 8px;
}

.photostream {
  padding: 0;
  transition: padding 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.photostream :hover {
  cursor: pointer;
}

.unselectable :hover {
  cursor: default;
}
</style>
