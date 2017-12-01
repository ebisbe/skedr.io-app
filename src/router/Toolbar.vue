<template>
    <v-toolbar app fixed :class="[activeFab.class]" dark>
        <h1>{{ title }}</h1>
        <v-spacer></v-spacer>
        <v-toolbar-items>
            <v-btn flat class="mr-4 deep-purple" to="/login">
                Log in
            </v-btn>
            <v-btn flat class="mr-4 deep-purple" to="/signup">
                Sign up
            </v-btn>
        </v-toolbar-items>
    </v-toolbar>
</template>
<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'Toolbar',
    data () {
      return {
        title: 'Qronos'
      }
    },
    computed: {
      ...mapGetters(['activeFab'])
    }
  }
</script>
