<template>
  <v-navigation-drawer
    v-model="menuDrawer"
    clipped
    fixed
    app
  >
    <v-list shaped>
      <v-list-item
        v-for="item in lists"
        :to="{name: item.pathName}"
        :key="item.name"
        exact
        ripple>
        <v-list-item-action>
          <v-icon v-html="item.icon"/>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title v-t="item.name"/>
        </v-list-item-content>
      </v-list-item>
      <v-divider/>
      <v-subheader v-t="'Layout.articles'"/>
      <v-list-item
        v-for="article in articles"
        :key="article.name"
        :href="article.link"
        ripple
        target="_blank">
        <v-list-item-action>
          <v-icon>link</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>
            {{ $t(article.name) }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-divider/>
      <v-list-item ripple @click="openBeacon">
        <v-list-item-action>
          <v-icon>announcement</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title v-t="'Layout.feedback'"/>
        </v-list-item-content>
      </v-list-item>
      <v-list-item
        ripple
        class="triggerChangelog"
        @click.stop
      >
        <v-list-item-action>
          <v-icon class="changelog" >notification_important</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title v-t="'Layout.changelog'"/>
        </v-list-item-content>
      </v-list-item>
      <v-list-item
        ripple
      >
        <v-list-item-action>
          <v-icon>language</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>
            <language-selector />
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-divider/>
      <v-list-item ripple @click.stop="logout">
        <v-list-item-action>
          <v-icon>input</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title v-t="'Layout.sign_out'"/>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import LanguageSelector from '@/components/layout/LanguageSelector'

export default {
  components: { LanguageSelector },
  data: function() {
    return {
      lists: [
        {
          icon: 'perm_media',
          pathName: 'AutoimportTags',
          name: 'Layout.autoimport_tags'
        },
        {
          icon: 'photo',
          pathName: 'Photostream',
          name: 'Layout.photostream'
        },
        {
          icon: 'access_time',
          pathName: 'Scheduled photos',
          name: 'Layout.scheduled_photos'
        },
        {
          icon: 'person',
          pathName: 'Profile',
          name: 'Layout.profile'
        }
      ],
      articles: [
        {
          name: 'Layout.article1',
          link: 'https://skedr.io/articles/share-single-photo'
        },
        {
          name: 'Layout.article2',
          link: 'https://skedr.io/articles/group-tagging'
        }
      ]
    }
  },
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
      trigger: '.triggerChangelog'
    }
    Headway.init(config)
  },
  methods: {
    ...mapMutations({
      setDrawer: 'menuDrawer/set'
    }),
    ...mapActions({
      signOut: 'user/signOut'
    }),
    openBeacon() {
      Beacon('toggle')
    },
    logout: async function() {
      try {
        await this.signOut()
        this.$router.push({ name: 'Login' })
      } catch (err) {
        this.$store.dispatch('message/add', err.message)
        if (err.name === 'VerifyEmailError') {
          this.$router.push({ name: 'Profile' })
        }
      }
    }
  }
}
</script>

