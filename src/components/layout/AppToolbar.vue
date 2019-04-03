<template>
  <div>
    <v-navigation-drawer
      v-model="drawer"
      clipped
      fixed
      app
    >
      <v-list>
        <v-list-tile
          v-for="item in lists"
          :to="{name: item.name}"
          :key="item.name"
          exact
          ripple>
          <v-list-tile-action>
            <v-icon v-html="item.icon"/>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-html="item.name"/>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider/>
        <v-subheader>Articles</v-subheader>
        <v-list-tile
          v-for="article in articles"
          :key="article.name"
          :href="article.link"
          ripple
          target="_blank">
          <v-list-tile-action>
            <v-icon>link</v-icon>
          </v-list-tile-action>
          <v-list-tile-content >
            <v-list-tile-title v-html="article.name"/>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider/>
        <v-list-tile ripple @click="feedbackDialog = true">
          <v-list-tile-action>
            <v-icon>announcement</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Send feedback</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile
          ripple
          class="triggerChangelog"
          @click.stop
        >
          <v-list-tile-action>
            <v-icon class="changelog" >notification_important</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Changelog</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider/>
        <v-list-tile ripple @click.stop="logout">
          <v-list-tile-action>
            <v-icon>input</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Sign out</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      <app-feedback-popup
        :feedback-dialog="feedbackDialog"
        @close="feedbackDialog = false"/>
    </v-navigation-drawer>
    <v-toolbar
      :dense="false"
      app
      fixed
      color="primary"
      dark
      style="z-index:3;"
      clipped-left
      clipped-right>
      <v-toolbar-side-icon @click.stop="toggle"/>
      <v-toolbar-title v-text="pageTitle" />
      <v-spacer/>
      <v-text-field
        v-model="search"
        :loading="loading"
        prepend-inner-icon="search"
        solo-inverted
        flat
        hide-details
        clearable
        label="Search"
        @keyup.enter="$router.push({name: 'AutoimportTagsSearch'})"
        @click:clear="$router.push({name: 'AutoimportTagsList'})"
      />
      <v-spacer/>
      <v-btn
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
      <app-pool-btn/>
    </v-toolbar>
    <app-notification-list :drawer="notificationDrawer" @updated="notificationDrawer = $event"/>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import AppPoolBtn from './AppPoolBtn.vue'
import AppFeedbackPopup from './AppFeedbackPopup'
import AppNotificationList from './AppNotificationList'

import Auth from '@aws-amplify/auth';

export default {
  name: 'Toolbar',
  components: { AppPoolBtn, AppFeedbackPopup, AppNotificationList },
  data: () => {
    return {
      title: 'Layout',
      drawer: false,
      showBadge: false,
      notificationDrawer: false,
      feedbackDialog: false,
      lists: [
        {
          icon: 'perm_media',
          name: 'AutoimportTags'
        },
        {
          icon: 'photo',
          name: 'Photostream'
        },
        {
          icon: 'access_time',
          name: 'Scheduled photos'
        }
      ],
      articles: [
        {
          name: 'Sharing an existing photo',
          link: 'https://skedr.io/articles/share-single-photo'
        },
        {
          name: 'Group tagging',
          link: 'https://skedr.io/articles/group-tagging'
        }
      ]
    }
  },
  computed: {
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
  mounted() {
    this.drawer = this.$vuetify.breakpoint.lgAndpUp
    const config = {
      selector: '.changelog', // CSS selector where to inject the badge
      account: 'yZ6Dpy',
      trigger: '.triggerChangelog .v-list__tile'
    }
    Headway.init(config)
  },
  methods: {
    toggle() {
      this.drawer = !this.drawer
    },
    logout: async function() {
      try {
        await Auth.signOut()
        this.$router.push({ name: 'Login' })
      } catch (err) {
        this.$store.dispatch('message/add', err.message)
      }
    }
  }
}
</script>
