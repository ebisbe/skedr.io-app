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
