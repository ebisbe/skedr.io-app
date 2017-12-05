<template>
    <v-btn flat icon
           @click.stop="rightDrawer = !rightDrawer"
           class="deep-purple ligthen-2"
    >
        <v-icon v-text="poolIcon"></v-icon>
    </v-btn>
</template>
<script>
  import { mapState } from 'vuex'

  export default {
    computed: {
      ...mapState(['pool']),
      rightDrawer: {
        get () {
          return this.$store.state.rightDrawer
        },
        set (value) {
          this.$store.commit('updateRightDrawer', value)
        }
      },
      poolIcon () {
        switch (this.pool.length) {
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
            return `filter_${this.pool.length}`
          default:
            return 'filter_9_plus'
        }
      }
    }
  }
</script>