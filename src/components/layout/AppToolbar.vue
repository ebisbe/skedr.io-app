<template>
  <div>
    <v-toolbar
      :dense="false"
      :color="alternativeBar ? 'accent' : 'primary'"
      app
      fixed
      dark
      style="z-index:3;"
      clipped-left
      clipped-right>
      <v-toolbar-side-icon v-if="!alternativeBar" @click.stop="toggle"/>
      <v-btn
        v-else
        icon
        @click="clearPool"
      >
        <v-icon>close</v-icon>
      </v-btn>

      <v-toolbar-title v-text="toolbarTitle" />
      <v-spacer/>
      <v-scale-transition>
        <v-text-field
          v-if="!alternativeBar"
          v-model="search"
          :loading="loading"
          :label="$t('label.search')"
          prepend-inner-icon="search"
          solo-inverted
          flat
          hide-details
          clearable
          @keyup.enter="$router.push({name: 'AutoimportTagsSearch'})"
          @click:clear="$router.push({name: 'AutoimportTagsList'})"
        />
      </v-scale-transition>
      <v-spacer/>
      <v-tooltip
        v-if="poolHasItems"
        bottom
        lazy>
        <v-btn
          slot="activator"
          icon
          @click.stop="showShareDialog = true">
          <v-icon>share</v-icon>
        </v-btn>
        <span v-t="'Layout.sked_photos'"/>
      </v-tooltip>
      <v-tooltip
        v-else-if="schedulerPoolHasItems"
        bottom
        lazy>
        <v-btn
          slot="activator"
          icon
          @click.stop="deleteSchedulerPhotos">
          <v-icon>delete</v-icon>
        </v-btn>
        <span v-t="'Layout.clear_queue'"/>
      </v-tooltip>
      <v-btn
        v-else
        color="primary"
        icon
        @click="() => {
          notificationDrawer = true
          showBadge = false
        }"
      >
        <v-badge
          v-model="showBadge"
          color="red"
          right
          overlap
        >
          <span slot="badge" >!</span>
          <v-icon medium>
            notifications
          </v-icon>
        </v-badge>
      </v-btn>
    </v-toolbar>
    <app-notification-list :drawer="notificationDrawer" @updated="notificationDrawer = $event"/>
    <share-dialog :show-dialog="showShareDialog" @close="showShareDialog = false" />
  </div>
</template>
<script>
import { mapState, mapMutations, mapGetters, mapActions } from 'vuex'
import AppNotificationList from './AppNotificationList'
import ShareDialog from '@/components/dialog/ShareDialog.vue'

import Auth from '@aws-amplify/auth'

export default {
  name: 'Toolbar',
  components: { AppNotificationList, ShareDialog },
  data: () => {
    return {
      title: 'Layout',
      showBadge: false,
      notificationDrawer: false,
      showShareDialog: false
    }
  },
  computed: {
    toolbarTitle() {
      if (this.poolHasItems) {
        return `${this.poolLength} selected`
      } else if (this.schedulerPoolHasItems) {
        return `${this.schedulerPoolLength} selected`
      } else {
        return this.pageTitle
      }
    },
    alternativeBar() {
      return this.poolHasItems || this.schedulerPoolHasItems
    },
    ...mapGetters({
      poolHasItems: 'pool/hasItems',
      poolLength: 'pool/total',
      schedulerPoolHasItems: 'schedulerPool/hasItems',
      schedulerPoolLength: 'schedulerPool/total',
      schedulerPhotos: 'schedulerPool/items'
    }),
    ...mapState({
      pageTitle: state => state.pageTitle,
      loading: state => (state.loading > 0 ? 'accent' : false)
    }),
    search: {
      get() {
        return this.$store.state.search
      },
      set(value) {
        if (value === null) {
          value = ''
        }
        this.$store.commit('updateSearch', value)
      }
    }
  },
  methods: {
    clearPool() {
      this.clearPhotoPool()
      this.clearSchedulerPool()
    },
    ...mapMutations({
      toggle: 'menuDrawer/toggle',
      clearPhotoPool: 'pool/clear',
      clearSchedulerPool: 'schedulerPool/clear',
      scheduledPhotos: 'schedulerPool/items'
    }),
    deleteSchedulerPhotos: async function() {
      for (const { groupId, photoId } of this.schedulerPhotos)
        await this.$apollo.mutate({
          mutation: require('@/graphql/mutations/deleteScheduledPhoto.gql'),
          variables: { groupId: groupId, photoId: photoId }
        })

      this.clearSchedulerPool()
    }
  }
}
</script>
