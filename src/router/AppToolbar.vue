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
        <v-toolbar app fixed :class="[activeFab.class]" dark clipped-left clipped-right>
            <v-toolbar-title class="pr-3"
                             :style="$vuetify.breakpoint.mdAndUp ? 'width: 300px; min-width: 250px' : 'min-width: 130px'">
                <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
                <span class="hidden-xs-only" v-text="pageTitle"></span>
            </v-toolbar-title>
            <q-filter placeholder="Filter groups" @search="search"
                      v-if="this.$router.currentRoute.name === 'Group'"></q-filter>
            <v-spacer v-if="addingPhotosToGroup"></v-spacer>
            <div v-if="addingPhotosToGroup" class="title">{{ selectedGroups.length }} groups selected</div>
            <v-spacer v-if="$vuetify.breakpoint.mdAndUp"></v-spacer>

            <v-btn flat
                   @click.stop="rightDrawer = !rightDrawer"
                   class="deep-purple ligthen-2"
            >
                <span class="hidden-xs-only">Photo pool&nbsp;&nbsp;</span>
                <v-icon>{{ poolIcon }}</v-icon>
            </v-btn>
        </v-toolbar>
    </div>
</template>
<script>
  import { mapGetters, mapState } from 'vuex'
  import QFilter from './../components/QFilter.vue'

  export default {
    name: 'Toolbar',
    components: {QFilter},
    data () {
      return {
        title: 'Layout',
        drawer: false,
        lists: [
          {
            icon: 'dashboard',
            name: 'Dashboard'
          },
          {
            icon: 'view_day',
            name: 'Group'
          },
          {
            icon: 'access_time',
            name: 'Scheduled'
          },
          {
            icon: 'photo',
            name: 'Photos'
          }
        ]
      }
    },
    computed: {
      ...mapState([
        'pool',
        'selectedGroups',
        'pageTitle'
      ]),
      ...mapGetters([
        'activeFab',
        'addingPhotosToGroup'
      ]),
      rightDrawer: {
        get () {
          return this.$store.state.rightDrawer
        },
        set (value) {
          this.$store.commit('updateRightDrawer', value)
        }
      },
      poolIcon () {
        switch (this.pool.length) {
          case 0:
            return 'filter'
          case 1:
          case 2:
          case 3:
          case 4:
          case 5:
          case 6:
          case 7:
          case 8:
          case 9:
            return `filter_${this.pool.length}`
          default:
            return 'filter_9_plus'
        }
      }
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
