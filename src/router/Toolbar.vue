<template>
    <v-toolbar app fixed color="primary">
        <h1>{{ title }}</h1>
        <v-spacer></v-spacer>
        <v-toolbar-items>
            <v-btn flat class="mr-4" to="/login">
                Log in
            </v-btn>
            <v-btn flat class="mr-4" to="/signup">
                Sign up
            </v-btn>
        </v-toolbar-items>
    </v-toolbar>
</template>
<script>
  export default {
    name: 'Toolbar',
    data () {
      return {
        title: 'Skedr'
      }
    }
  }
</script>
