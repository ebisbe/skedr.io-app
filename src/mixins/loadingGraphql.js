export default {
  computed: {
    loadingGraphql: {
      set: function(value) {
        this.$store.commit('setLoading', value)
      },
      get: function() {
        return this.$store.state.loading
      }
    }
  }
}
