<template>
    <v-navigation-drawer temporary right v-model="rightDrawer">
        <v-list>
            <v-list-tile>
                <v-list-tile-action>
                    <v-icon light>inbox</v-icon>
                </v-list-tile-action>
                <v-list-tile-title>Photo pool</v-list-tile-title>
            </v-list-tile>
        </v-list>

        <v-container fluid grid-list-md>
            <div class="layout wrap row">
                <v-flex xs6 v-for="photo in pool" :key="photo.id">
                    <v-card tile>
                        <v-card-media :src="photo.url_m" height="150px">
                            <v-btn class="gray darken-2" small light fab
                                   @click.native.stop="$store.commit('addToPool', {photo: photo, add: false})">
                                <v-icon>close</v-icon>
                            </v-btn>
                        </v-card-media>
                    </v-card>
                </v-flex>
            </div>
        </v-container>
    </v-navigation-drawer>
</template>
<script>
  import { mapState } from 'vuex'

  export default {
    name: 'RightBar',
    computed: {
      ...mapState([
        'pool'
      ]),
      rightDrawer: {
        get () {
          return this.$store.state.rightDrawer
        },
        set (value) {
          this.$store.commit('updateRightDrawer', value)
        }
      }
    }
  }
</script>