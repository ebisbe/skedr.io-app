<template>
  <v-sheet
    v-bind="$attrs"
    class="grey lighten-2"
    @mouseover="hover = externalLink !== '' ? true : false"
    @mouseleave="hover = false"
    v-on="$listeners">
    <slot name="header"/>
    <external-link-badge
      :hover="hover"
      :href="externalLink"
      style="display:block !important;">
      <v-img
        :height="height"
        :src="url"
        :lazy-src="url"
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
      <span>Private image</span>
    </v-tooltip>
    <slot name="footer"/>
  </v-sheet>
</template>
<script>
import ExternalLinkBadge from '@/components/common/ExternalLinkBadge'

export default {
  components: { ExternalLinkBadge },
  props: {
    height: {
      type: Number,
      default: 205
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
    }
  },
  data: () => ({ hover: false })
}
</script>
<style scoped>
.img {
  border-bottom-left-radius: 2px;
  border-bottom-right-radius: 2px;
  transition: height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.non-public {
  position: absolute;
  top: 8px;
  right: 8px;
}
</style>


