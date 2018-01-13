<template>
    <div>
        <v-navigation-drawer
                clipped
                fixed
                app
                v-model="drawer"
        >
            <v-list>
                <v-list-tile v-for="item in lists" :to="{name: item.name}" :key="item.name" ripple>
                    <v-list-tile-action>
                        <v-icon v-html="item.icon"></v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title v-html="item.name"></v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-divider></v-divider>
                <v-list-tile @click="suggestionDialog = true" ripple>
                    <v-list-tile-action>
                        <v-icon>help</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Suggestions & Bugs</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-divider></v-divider>
                <v-list-tile @click.stop="logout" ripple>
                    <v-list-tile-action>
                        <v-icon>input</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Logout</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
            <q-suggestion-dialog :suggestionDialog="suggestionDialog" @close="suggestionDialog = false"></q-suggestion-dialog>
        </v-navigation-drawer>
        <v-toolbar app fixed color="primary" dark clipped-left clipped-right prominent>
            <v-toolbar-title class="pr-3" style="width: 300px">
                <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
                <span v-text="pageTitle"></span>
            </v-toolbar-title>
            <q-filter placeholder="Filter groups" @search="search" :solo-inverted="true"></q-filter>
            <v-spacer></v-spacer>

            <v-toolbar-items>
                <q-pool-btn></q-pool-btn>
            </v-toolbar-items>
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
    components: {QFilter, QPoolBtn, QSuggestionDialog},
    data () {
      return {
        title: 'Layout',
        drawer: this.isDesktop,
        suggestionDialog: false,
        lists: [
          {
            icon: 'view_day',
            name: 'Group'
          },
          {
            icon: 'access_time',
            name: 'Scheduled photos'
          },
          {
            icon: 'photo',
            name: 'Photostream'
          }
        ]
      }
    },
    computed: {
      ...mapState([
        'pageTitle'
      ]),
      ...mapGetters([
        'isDesktop'
      ])
    },
    methods: {
      logout () {
        this.$store.dispatch('signOut')
          .then(() => this.$router.push({name: 'Home'}))
          .catch(() => this.$router.push({name: 'Home'}))
      },
      search (value) {
        this.$store.commit('updateSearch', value)
      }
    }
  }
</script>
