<template>
  <div>
    <v-navigation-drawer
      clipped
      fixed
      app
      v-model="drawer"
    >
      <v-list>
        <v-list-tile
          v-for="item in lists"
          :to="{name: item.name}"
          :key="item.name"
          ripple>
          <v-list-tile-action>
            <v-icon v-html="item.icon"/>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-html="item.name"/>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider/>
        <v-list-tile
          @click="suggestionDialog = true"
          ripple>
          <v-list-tile-action>
            <v-icon>announcement</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Send feedback</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider/>
        <v-list-tile
          @click.stop="logout"
          ripple>
          <v-list-tile-action>
            <v-icon>input</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Sign out</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      <q-suggestion-dialog
        :suggestion-dialog="suggestionDialog"
        @close="suggestionDialog = false"/>
    </v-navigation-drawer>
    <v-toolbar
      app
      fixed
      color="primary"
      dark
      clipped-left
      clipped-right>
      <v-toolbar-title
        class="pr-3"
        style="width: 300px">
        <v-toolbar-side-icon @click.stop="drawer = !drawer"/>
        <span v-text="pageTitle"/>
      </v-toolbar-title>
      <q-filter
        placeholder="Filter groups"
        @search="search"
        :solo-inverted="true"/>
      <v-spacer/>
      <v-btn icon class="hidden-sm-and-up">
        <v-icon>search</v-icon>
      </v-btn>
      <q-pool-btn/>
    </v-toolbar>
  </div>
</template>
<script>
import { mapGetters, mapState } from 'vuex'
import QFilter from './../components/QFilter.vue'
import QPoolBtn from './../components/QPoolBtn.vue'
import QSuggestionDialog from './../components/QSuggestionDialog'

export default {
  name: 'Toolbar',
  components: { QFilter, QPoolBtn, QSuggestionDialog },
  data() {
    return {
      title: 'Layout',
      drawer: this.isDesktop,
      suggestionDialog: false,
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
          icon: 'view_day',
          name: 'Group'
        }
      ]
    }
  },
  computed: {
    ...mapState(['pageTitle']),
    ...mapGetters(['isDesktop'])
  },
  methods: {
    logout() {
      this.$store
        .dispatch('signOut')
        .then(() => this.$router.push({ name: 'Home' }))
        .catch(() => this.$router.push({ name: 'Home' }))
    },
    search(value) {
      this.$store.commit('updateSearch', value)
    }
  }
}
</script>
