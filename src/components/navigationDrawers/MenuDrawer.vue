<template>
  <v-navigation-drawer
    v-model="menuDrawer"
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
      <v-list-tile ripple @click="openBeacon">
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
  </v-navigation-drawer>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
export default {
  data: () => ({
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
  }),
  computed: {
    menuDrawer: {
      get() {
        return this.$store.state.menuDrawer.isVisible
      },
      set(value) {
        this.$store.commit('menuDrawer/set', value)
      }
    }
  },
  mounted() {
    this.setDrawer(this.$vuetify.breakpoint.lgAndpUp)
    const config = {
      selector: '.changelog', // CSS selector where to inject the badge
      account: 'yZ6Dpy',
      trigger: '.triggerChangelog .v-list__tile'
    }
    Headway.init(config)
  },
  methods: {
    ...mapMutations({
      setDrawer: 'menuDrawer/set'
    }),
    openBeacon() {
      Beacon('toggle')
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

