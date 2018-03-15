<template>
  <v-app light v-resize="resize">

    <router-view name="toolbar"/>
    <router-view/>
    <router-view name="rightBar"/>

  </v-app>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'App',
  mounted() {
    this.onResize({ width: window.innerWidth, height: window.innerHeight })
  },
  methods: {
    resize() {
      this.onResize({ width: window.innerWidth, height: window.innerHeight })
    },
    ...mapActions({
      onResize: 'windowSize'
    })
  }
}
</script>
<style>
.topFloat {
  position: absolute;
  top: 0;
  left: 0;
}
.fullWidth {
  width: 100%;
  width: -moz-available; /* WebKit-based browsers will ignore this. */
  width: -webkit-fill-available; /* Mozilla-based browsers will ignore this. */
  width: fill-available;
}
</style>
