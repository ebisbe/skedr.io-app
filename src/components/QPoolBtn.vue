<template>
  <v-tooltip bottom>
    <v-btn
      slot="activator"
      icon
      class="deep-purple ligthen-2"
      @click.stop="rightDrawer = !rightDrawer">
      <v-icon v-text="poolIcon"/>
    </v-btn>
    <span>Pool</span>
  </v-tooltip>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    rightDrawer: {
      get() {
        return this.$store.state.rightDrawer
      },
      set(value) {
        this.$store.commit('updateRightDrawer', value)
      }
    },
    ...mapGetters({
      length: 'pool/length'
    }),
    poolIcon() {
      switch (this.length) {
        case 0:
          return 'filter'
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
        case 8:
        case 9:
          return `filter_${this.length}`
        default:
          return 'filter_9_plus'
      }
    }
  }
}
</script>
