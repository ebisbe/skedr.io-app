<template>
  <v-toolbar
    app
    fixed
    color="primary"
    dark>
    <h1>
      <router-link
        to="/"
        style="color: #fff; text-decoration: none;"
        v-html="title"/>
    </h1>
    <v-spacer/>
    <v-toolbar-items>
      <v-btn
        :to="{name: 'Login'}"
        flat
        class="mr-4">
        Log in
      </v-btn>
      <v-btn
        :to="{name: 'Signup'}"
        flat
        class="mr-4">
        Sign up
      </v-btn>
    </v-toolbar-items>
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
