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
      <q-suggestion-dialog
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
      clipped-left
      clipped-right>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"/>
      <v-toolbar-title style="width: 300px" v-text="pageTitle" />
      <v-flex
        :slot="useExtended ? 'extension' : ''"
        class="pa-1">
        <q-filter
          :solo-inverted="true"
          placeholder="Search ..."
          @search="searchText"/>
      </v-flex>
      <v-spacer />
      <v-btn
        v-show="showSearch && $vuetify.breakpoint.smAndUp"
        icon
        @click="showSearch = true">
        <v-icon>search</v-icon>
      </v-btn>
      <v-text-field
        v-show="showSearch"
        v-model="search"
        :append-icon-cb="() => {showSearch = false; search =''}"
        color="white"
        hide-details
        class="py-2"
        append-icon="close"
        placeholder="Search ..."/>
      <q-pool-btn/>
    </v-toolbar>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import QFilter from './../components/QFilter.vue'
import QPoolBtn from './../components/QPoolBtn.vue'
import QSuggestionDialog from './../components/QSuggestionDialog'

export default {
  name: 'Toolbar',
  components: { QFilter, QPoolBtn, QSuggestionDialog },
  data: () => {
    return {
      title: 'Layout',
      drawer: false,
      suggestionDialog: false,
      search: '',
      showSearch: false,
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
    useExtended() {
      return this.showSearch && this.$vuetify.breakpoint.xsOnly
    },
    showSearch() {
      return this.$route.path !== '/scheduled'
    }
  },
  watch: {
    search(value) {
      this.$store.commit('updateSearch', value)
    }
  },
  mounted() {
    this.drawer = this.$vuetify.breakpoint.lgAndpUp
  },
  methods: {
    logout() {
      this.$store
        .dispatch('signOut')
        .then(() => this.$router.push({ name: 'Home' }))
        .catch(() => this.$router.push({ name: 'Home' }))
    },
    searchText(value) {
      this.$store.commit('updateSearch', value)
    }
  }
}
</script>
