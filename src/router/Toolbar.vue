<template>
  <v-toolbar
    app
    fixed
    color="white">
    <h1>
      <router-link
        to="/"
        class="grey--text darken-2"
        style="text-decoration: none;"
        v-html="title"/>
    </h1>
    <v-spacer/>
    <v-btn
      :to="{name: 'Photostream'}"
      flat
      class="mr-4 grey--text darken-2">
      Log in
    </v-btn>
    <v-btn
      :to="{name: 'Signup'}"
      color="primary"
      class="mr-4">
      Sign up
    </v-btn>
  </v-toolbar>
</template>
<script>
export default {
  name: 'Toolbar',
  data() {
    return {
      title: 'Beta - Skedr.io'
    }
  }
}
</script>
