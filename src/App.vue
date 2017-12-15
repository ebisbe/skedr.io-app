<template>
    <v-app light>

        <router-view name="toolbar"></router-view>
        <router-view></router-view>
        <router-view name="rightBar"></router-view>

        <v-footer app :class="[activeFab.class]" fixed>
            <v-layout row wrap align-center>
                <v-flex xs12>
                    <div class="white--text ml-3">
                        Made with
                        <v-icon class="red--text">favorite</v-icon>
                        <span class="text-xs-right">2018</span>
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
