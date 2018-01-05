<template>
    <v-app light>

        <router-view name="toolbar"></router-view>
        <router-view></router-view>
        <router-view name="rightBar"></router-view>

        <v-footer app color="primary">
            <v-layout row wrap align-center class="white--text">
                <v-flex xs3>
                    <div class="ml-3">
                        Made with
                        <v-icon class="red--text">favorite</v-icon>
                        <span class="text-xs-right">2018</span>


                    </div>
                </v-flex>
                <v-spacer></v-spacer>
            </v-layout>
        </v-footer>
        <q-share-dialog :pool="sharePool"></q-share-dialog>
    </v-app>
</template>

<script>
  import { mapState } from 'vuex'
  import QShareDialog from './components/QShareDialog'

  export default {
    name: 'app',
    components: {QShareDialog},
    computed: {
      ...mapState([
        'sharePool'
      ])
    }
  }
</script>
