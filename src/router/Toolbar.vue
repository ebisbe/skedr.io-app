<template>
    <v-toolbar app fixed :class="[activeFab.class]" dark>
        <v-toolbar-side-icon></v-toolbar-side-icon>

        <v-toolbar-title>
            <router-link v-text="title" to="/"></router-link>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
            <v-btn flat class="mr-4 deep-purple">
                Log in
            </v-btn>
            <v-btn flat class="mr-4 deep-purple">
                Sign up
            </v-btn>
        </v-toolbar-items>
    </v-toolbar>
</template>
<script>
  import { mapGetters, mapState } from 'vuex'

  export default {
    name: 'Toolbar',
    data () {
      return {
        title: 'Layout'
      }
    },
    computed: {
      ...mapState([
        'pool',
        'selectedGroups'
      ]),
      ...mapGetters([
        'activeFab',
        'addingPhotosToGroup'
      ])
    }
  }
</script>