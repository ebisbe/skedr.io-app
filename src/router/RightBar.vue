<template>
    <v-navigation-drawer clipped absolute fixed app right v-model="rightDrawer">
        <v-container fluid grid-list-md>
            <v-btn block color="error" small outline @click="clearPool"><v-icon>delete</v-icon>&nbsp;Clear Pool</v-btn>
            <v-list subheader>
                <template v-for="(photo, key) in pool">
                    <v-divider v-show="key !== 0" inset></v-divider>
                    <v-list-tile avatar :key="photo.title" @click="">
                        <v-list-tile-avatar>
                            <img :src="photo.url_sq"/>
                        </v-list-tile-avatar>
                        <v-list-tile-content>
                            <v-list-tile-title v-html="photo.title"></v-list-tile-title>
                        </v-list-tile-content>
                        <v-list-tile-action>
                            <v-btn icon ripple
                                   @click.native.stop="$store.commit('addToPool', {photo: photo, add: false})">
                                <v-icon>close</v-icon>
                            </v-btn>
                        </v-list-tile-action>
                    </v-list-tile>
                </template>
            </v-list>
        </v-container>
    </v-navigation-drawer>
</template>
<script>
  import { mapState } from 'vuex'

  export default {
    name: 'RightBar',
    methods: {
      clearPool () {
        this.$store.commit('clearPool')
      }
    },
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
