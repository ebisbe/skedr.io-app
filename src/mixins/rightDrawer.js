export default {
  computed: {
    rightDrawer: {
      get() {
        return this.$store.state.rightDrawer
      },
      set(value) {
        this.$store.dispatch('updateRightDrawer', value)
      }
    }
  }
}
