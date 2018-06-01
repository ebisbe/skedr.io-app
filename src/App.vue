<template>
  <v-app v-resize="resize" light>

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
  width: stretch;
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
.sked-photo .container {
  position: absolute;
  bottom: 0;
  left: 0;
  padding: inherit;
}
.sked-photo .container .list {
  padding: 0;
  border-bottom-left-radius: 2px;
  border-bottom-right-radius: 2px;
  background-color: rgba(66, 66, 66, 0.5) !important;
}
.sked-photo .container .list .white--text {
  text-decoration: none;
}
.sked-photo .card__media {
  border-bottom-left-radius: 2px;
  border-bottom-right-radius: 2px;
  transition: height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
