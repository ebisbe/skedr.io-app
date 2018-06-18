<template>
  <v-btn
    slot="activator"
    icon
    class="deep-purple ligthen-2"
    @click.stop="rightDrawer = !rightDrawer">
    <v-icon v-text="poolIcon"/>
  </v-btn>
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
        this.$store.dispatch('updateRightDrawer', value)
      }
    },
    ...mapGetters({
      length: 'pool/length'
    }),
    poolIcon() {
      if (this.length > 9) {
        return 'filter_9_plus'
      }
      if (this.length === 0) {
        return 'filter'
      }
      return `filter_${this.length}`
    }
  }
}
</script>
