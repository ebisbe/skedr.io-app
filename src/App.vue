<template>
    <v-app light>

        <router-view name="toolbar"></router-view>
        <router-view></router-view>
        <router-view name="rightBar"></router-view>

        <v-footer app :class="[activeFab.class]" fixed>
            <v-layout row wrap align-center class="white--text">
                <v-flex xs3>
                    <div class="ml-3">
                        Made with
                        <v-icon class="red--text">favorite</v-icon>
                        <span class="text-xs-right">2018</span>


                    </div>
                </v-flex>
                <v-flex v-if="selectedGroups.length" class="title">
                    <div class="text-xs-center"> {{ selectedGroups.length }} groups selected</div>
                </v-flex>
                <v-spacer></v-spacer>
            </v-layout>
        </v-footer>
    </v-app>
</template>

<script>
  import { mapGetters, mapState } from 'vuex'

  export default {
    name: 'app',
    computed: {
      ...mapGetters([
        'activeFab'
      ]),
      ...mapState([
        'selectedGroups'
      ])
    }
  }
</script>
