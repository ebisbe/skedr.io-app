<template>
  <v-sheet v-bind="$attrs">
    <slot name="header"/>
    <v-img
      :height="height"
      :src="url"
      :lazy-src="url"
      aspect-ratio="1"
      class="grey lighten-2 img">
      <v-layout
        slot="placeholder"
        fill-height
        align-center
        justify-center
        ma-0>
        <v-progress-circular indeterminate color="grey lighten-5"/>
      </v-layout>
    </v-img>
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
export default {
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

.non-public {
  position: absolute;
  top: 8px;
  right: 8px;
}
</style>


