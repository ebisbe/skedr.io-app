<template>
  <v-sheet
    v-bind="$attrs"
    :class="{ photostream: selectable, unselectable: !selectable }"
    tile
    style="position:relative;"
    class="grey lighten-2"
    @mouseover="selectable ? (hover = true) : null"
    @mouseleave="hover = false"
    v-on="$listeners"
  >
    <app-observer v-if="showObserver" @intersect="showObserver = false" />
    <slot name="header" />
    <v-tooltip v-if="isPrivate" left>
      <template v-slot:activator="{ on }">
        <v-icon large class="warning--text non-public" v-on="on">
          lock
        </v-icon>
      </template>
      <span v-t="'Layout.private_image'" />
    </v-tooltip>
    <v-icon v-if="isSelected" class="checkCircle" color="accent">
      check_circle
    </v-icon>
    <v-icon v-else-if="hover" class="checkCircle white--text">
      check_circle
    </v-icon>
    <v-icon v-else-if="isUserSelecting" class="checkCircle white--text">
      radio_button_unchecked
    </v-icon>
    <slot name="footer" />
  </v-sheet>
</template>
<script>
  import AppObserver from '@/components/common/AppObserver.vue'

  export default {
    components: { AppObserver },
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
        return !this.isSelected ? this.height : this.height - 24
      }
    }
  }
</script>
<style scoped>
  .img {
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
