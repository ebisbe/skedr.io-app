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
            </v-list>
        </v-navigation-drawer>

        <v-toolbar app fixed :class="[activeFab.class]" dark clipped-left clipped-right>
            <v-toolbar-title
                    :style="$vuetify.breakpoint.smAndUp ? 'width: 300px; min-width: 250px' : 'min-width: 72px'">
                <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
                <span class="hidden-xs-only" v-text="pageTitle"></span>
            </v-toolbar-title>
            <q-filter placeholder="Filter groups" @search="search"></q-filter>
            <v-spacer v-if="addingPhotosToGroup"></v-spacer>
            <div v-if="addingPhotosToGroup" class="title">{{ selectedGroups.length }} groups selected</div>
            <v-spacer ></v-spacer>

            <v-btn flat class="mr-4 deep-purple" @click.stop="logout">
                Logout
            </v-btn>
            <v-btn icon>
                <v-icon>settings</v-icon>
            </v-btn>
            <v-btn flat
                   @click.stop="rightDrawer = !rightDrawer"
                   class="deep-purple ligthen-2"
            >
                Photo pool&nbsp;&nbsp;
                <v-badge overlap color="red">
                    <span slot="badge">{{ pool.length }}</span>
                    <v-icon>filter</v-icon>
                </v-badge>
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