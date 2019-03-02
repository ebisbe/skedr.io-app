<template>
  <v-navigation-drawer
    v-model="rightDrawer"
    clipped
    fixed
    app
    right>
    <v-container
      fluid
      grid-list-md
      pa-0>
      <v-layout
        py-2
        px-3
        fluid>
        <v-flex xs6>
          <v-tooltip
            bottom
            lazy>
            <v-btn
              slot="activator"
              v-bind="$attrs"
              :disabled="disable"
              color="success"
              block
              small
              outline
              @click.stop="share({photos: pool})">
              <v-icon>share</v-icon><span>&nbsp;Sked</span>
            </v-btn>
            <span>{{ disable ? 'Select 1 or more photos' : toolbarTitle }}</span>
          </v-tooltip>
          <share-dialog />
        </v-flex>
        <v-flex xs6>
          <v-tooltip
            v-if="hasBackup"
            bottom
            lazy>
            <v-btn
              slot="activator"
              :disabled="!hasBackup"
              block
              color="accent"
              small
              outline
              @click="restoreBackup" >
              <v-icon>restore_from_trash</v-icon>&nbsp;Restore
            </v-btn>
            <span>Restore previous pool</span>
          </v-tooltip>
          <v-tooltip
            v-else
            bottom
            lazy>
            <v-btn
              slot="activator"
              :disabled="disable"
              block
              color="error"
              small
              outline
              @click="clearPool" >
              <v-icon>delete</v-icon>&nbsp;Clear
            </v-btn>
            <span>Clear pool</span>
          </v-tooltip>
        </v-flex>
      </v-layout>
      <v-list>
        <transition-group name="list">
          <template v-for="(photo, key) in pool">
            <v-divider
              v-if="key !== 0"
              :key="key"
            />
            <v-list-tile :key="photo.photoId" avatar>
              <v-list-tile-avatar>
                <img :src="photo.urlSq">
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title v-html="photo.title"/>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-btn
                  icon
                  ripple
                  @click.native.stop="remove(photo.photoId)">
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
import { mapState, mapActions, mapGetters } from 'vuex'
import ShareDialog from '@/components/dialog/ShareDialog'

export default {
  components: { ShareDialog },
  computed: {
    ...mapState('pool', {
      pool: state => state.photos
    }),
    ...mapGetters({
      disable: 'pool/isEmpty',
      hasBackup: 'pool/hasBackup'
    }),
    rightDrawer: {
      get() {
        return this.$store.state.rightDrawer
      },
      set(value) {
        this.$store.commit('updateRightDrawer', value)
      }
    },
    toolbarTitle() {
      return `Share ${this.pool.length} images`
    }
  },
  methods: {
    ...mapActions({
      remove: 'pool/remove',
      clearPool: 'pool/clearPool',
      restoreBackup: 'pool/restoreBackup',
      share: 'sharedPool/share'
    })
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
