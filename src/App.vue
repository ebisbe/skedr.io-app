<template>
    <v-app light toolbar footer>

        <router-view name="toolbar"></router-view>
        <main>
            <v-container fluid grid-list-xs>
                <router-view></router-view>
            </v-container>
        </main>
        <router-view name="rightBar"></router-view>

        <v-footer :class="[activeFab.class]">
            <v-layout row wrap align-center>
                <v-flex xs12>
                    <div class="white--text ml-3">
                        Made with
                        <v-icon class="red--text">favorite</v-icon>
                        by <a class="white--text" href="https://vuetifyjs.com" target="_blank">Vuetify</a>
                        and <a class="white--text" href="https://github.com/vwxyzjn">Costa Huang</a>
                    </div>
                </v-flex>
            </v-layout>
        </v-footer>
    </v-app>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'app',
    computed: {
      ...mapGetters([
        'activeFab'
      ])
    }
  }
</script>
