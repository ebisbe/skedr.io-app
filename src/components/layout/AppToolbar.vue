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
        <v-list-tile ripple @click="suggestionDialog = true">
          <v-list-tile-action>
            <v-icon>announcement</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Send feedback</v-list-tile-title>
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
      <app-suggestion-popup
        :suggestion-dialog="suggestionDialog"
        @close="suggestionDialog = false"/>
    </v-navigation-drawer>
    <v-toolbar
      :dense="false"
      :extended="useExtended"
      app
      fixed
      color="primary"
      dark
      style="z-index:3;"
      clipped-left
      clipped-right>
      <v-toolbar-side-icon @click.stop="toggle"/>
      <v-toolbar-title style="width: 300px" v-text="pageTitle" />
      <v-flex
        :slot="useExtended ? 'extension' : ''"
        class="pa-1">
        <q-filter
          solo-inverted
          placeholder="Search ..."
          @search="searchText"/>
      </v-flex>
      <v-spacer />
      <v-text-field
        v-model="search"
        prepend-icon="search"
        color="white"
        hide-details
        clearable
        class="py-2"
        placeholder="Search ..."/>
      <app-pool-btn/>
    </v-toolbar>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import QFilter from '@/components/ui/QFilter.vue'
import AppPoolBtn from './AppPoolBtn.vue'
import AppSuggestionPopup from './AppSuggestionPopup'

import { Auth } from 'aws-amplify'

export default {
  name: 'Toolbar',
  components: { QFilter, AppPoolBtn, AppSuggestionPopup },
  data: () => {
    return {
      title: 'Layout',
      drawer: false,
      suggestionDialog: false,
      search: '',
      lists: [
        {
          icon: 'photo',
          name: 'Photostream'
        },
        {
          icon: 'access_time',
          name: 'Scheduled photos'
        },
        {
          icon: 'perm_media',
          name: 'Groups'
        }
      ]
    }
  },
  computed: {
    ...mapState(['pageTitle']),
    useExtended() {
      return this.showSearch && this.$vuetify.breakpoint.xsOnly
    }
  },
  watch: {
    search(newVal) {
      newVal = newVal === null ? '' : newVal
      this.$store.commit('updateSearch', newVal)
    }
  },
  mounted() {
    this.drawer = this.$vuetify.breakpoint.lgAndpUp
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
    },
    searchText(value) {
      this.$store.commit('updateSearch', value)
    }
  }
}
</script>
