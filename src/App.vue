<template>
  <v-app light>

    <router-view name="toolbar"/>
    <router-view/>
    <router-view name="rightBar"/>

  </v-app>
</template>

<script>
export default {
  name: 'App'
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
