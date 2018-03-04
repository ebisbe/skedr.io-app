<template>
  <v-navigation-drawer
    clipped
    fixed
    app
    right
    v-model="rightDrawer">
    <v-container
      fluid
      grid-list-md>
      <v-layout
        pa-0
        fluid>
        <v-flex xs6>
          <v-btn
            block
            color="success"
            small
            outline
            @click="share"
            :disabled="disable">
            <v-icon>share</v-icon>&nbsp;Sked
          </v-btn>
        </v-flex>
        <v-flex xs6>
          <v-btn
            block
            color="error"
            small
            outline
            @click="clearPool"
            :disabled="disable">
            <v-icon>delete</v-icon>&nbsp;Clear
          </v-btn>
        </v-flex>
      </v-layout>
      <v-list subheader>
        <transition-group name="list">
          <template v-for="(photo, key) in pool">
            <v-divider
              :key="key"
              inset
              v-if="key !== 0"/>
            <v-list-tile
              avatar
              :key="photo.id">
              <v-list-tile-avatar>
                <img :src="photo.url_sq">
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title v-html="photo.title"/>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-btn
                  icon
                  ripple
                  @click.native.stop="$store.commit('addToPool', {photo: photo, add: false})">
                  <v-icon>close</v-icon>
                </v-btn>
              </v-list-tile-action>
            </v-list-tile>
          </template>
        </transition-group>
      </v-list>
    </v-container>
  </v-navigation-drawer>
</template>
<script>
import { mapState } from 'vuex'

export default {
  name: 'RightBar',
  computed: {
    ...mapState(['pool']),
    rightDrawer: {
      get() {
        return this.$store.state.rightDrawer
      },
      set(value) {
        this.$store.commit('updateRightDrawer', value)
      }
    },
    disable() {
      return this.pool.length === 0
    }
  },
  methods: {
    clearPool() {
      this.$store.commit('clearPool')
    },
    share() {
      this.$store.commit('showDialog', { pool: this.pool, selectedGroups: [] })
    }
  }
}
</script>
<style>
.list-enter-active {
  transition: all 0.5s;
}

.list-leave-active {
  transition: all 0.3s;
}

.list-enter {
  opacity: 0;
  transform: translateY(-30px);
}

.list-leave-to {
  opacity: 0;
}
</style>
