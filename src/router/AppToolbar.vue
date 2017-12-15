<template>
    <div>
        <v-navigation-drawer
                clipped
                absolute
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
                <v-list-tile @click.stop="logout" ripple>
                    <v-list-tile-action>
                        <v-icon>input</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Logout</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
        </v-navigation-drawer>
        <v-toolbar app fixed :class="[activeFab.class]" dark clipped-left clipped-right prominent>
            <v-toolbar-title class="pr-3">
                <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
                <span v-text="pageTitle"></span>
            </v-toolbar-title>
            <q-filter  placeholder="Filter groups" @search="search"
                      v-if="this.$router.currentRoute.name === 'Group'"></q-filter>
            <v-spacer v-else></v-spacer>


            <q-pool-btn></q-pool-btn>
        </v-toolbar>
    </div>
</template>
<script>
  import { mapGetters, mapState } from 'vuex'
  import QFilter from './../components/QFilter.vue'
  import QPoolBtn from './../components/QPoolBtn.vue'

  export default {
    name: 'Toolbar',
    components: {QFilter, QPoolBtn},
    data () {
      return {
        title: 'Layout',
        drawer: false,
        lists: [
          /*  {
              icon: 'dashboard',
              name: 'Dashboard'
            }, */
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
        'activeFab'
      ])
    },
    methods: {
      logout () {
        this.$store.dispatch('signOut')
          .then(() => { this.$router.push({name: 'Home'}) })
          .catch((err) => console.log(err))
      },
      search (value) {
        this.$store.commit('updateSearch', value)
      }
    }
  }
</script>
