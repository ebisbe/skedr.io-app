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
  position: absolute !important;
  top: 0;
  left: 0;
}
.fullWidth {
  width: 100%;
  width: -moz-available; /* WebKit-based browsers will ignore this. */
  width: -webkit-fill-available; /* Mozilla-based browsers will ignore this. */
  width: fill-available;
}
.sked-checkCircle {
  position: absolute;
  top: 8px;
  left: 8px;
}

.sked-photo {
  padding: 0;
  transition: padding 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.sked-photo:hover {
  cursor: pointer;
}
.sked-photo .list {
  position: absolute;
  width: 100%;
  bottom: 0;
  left: 0;
  padding: inherit;
  background-color: rgba(66, 66, 66, 0.5) !important;
}
.sked-photo .list .white--text {
  text-decoration: none;
}
.sked-photo .blur {
  border-bottom-left-radius: 2px;
  border-bottom-right-radius: 2px;
  filter: blur(5px);
}
.sked-photo .blur.loaded {
  transition: filter 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transition: height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  filter: blur(0px);
}
</style>
