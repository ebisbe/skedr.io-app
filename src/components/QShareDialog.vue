<template>
    <v-dialog v-model="dialog" persistent scrollable max-width="500px">
        <v-card>
            <v-toolbar dark color="primary">
                <v-btn icon @click.native="dialog = false" dark>
                    <v-icon>close</v-icon>
                </v-btn>
                <v-toolbar-title>Share Pool</v-toolbar-title>
            </v-toolbar>
            <v-progress-linear height="3" class="my-0" v-bind:indeterminate="true" v-if="loading"></v-progress-linear>
            <div class="pa-1" v-if="!saveImages">
                <q-filter placeholder="Search groups" class="pa-1"
                          @search="val => { filterWord = val }"
                          @ctrlEnter="selectFiltered"
                          @ctrlEsc="clearSelected"
                ></q-filter>
            </div>
            <v-card-text class="pa-0" v-if="!saveImages">
                <v-layout wrap v-if="filteredGroups.length">
                    <v-list two-line style="width: 100%;">
                        <v-subheader class="title">Groups</v-subheader>
                        <template v-for="group, key in filteredGroups">
                            <v-divider v-if="key!==0" inset></v-divider>
                            <v-list-tile avatar :key="group.title" @click="group.selected = !group.selected"
                                         :class="{selected: group.selected}">
                                <v-list-tile-action>
                                    <v-checkbox
                                            @click.prevent=""
                                            v-model="group.selected"
                                            hide-details
                                    ></v-checkbox>
                                </v-list-tile-action>
                                <v-list-tile-avatar>
                                    <img :src="group.icon">
                                </v-list-tile-avatar>
                                <v-list-tile-content>
                                    <v-list-tile-title v-html="group.title"></v-list-tile-title>
                                    <v-list-tile-sub-title>
                                        <v-layout row wrap>
                                            <span>Members: {{ group.members }}</span>
                                            <v-spacer></v-spacer>
                                            <span>Photos: {{ group.poolCount }}</span>
                                            <v-spacer></v-spacer>
                                            <span v-html="throttleText(group)"></span>&nbsp;<span>{{ group.throttleMode }}</span>
                                        </v-layout>
                                    </v-list-tile-sub-title>
                                </v-list-tile-content>
                            </v-list-tile>
                        </template>
                    </v-list>
                </v-layout>
                <v-layout v-else class="grey lighten-2">
                    <v-flex class="text-xs-center headline py-5 my-5">
                        No groups
                    </v-flex>
                </v-layout>
            </v-card-text>
            <q-push-photos
                    v-else
                    :pool="pool"
                    :groups="selectedGroups"
                    @loaded="dialog=false"
            ></q-push-photos>
            <transition name="footer">
                <v-toolbar dark color="primary" v-show="selectedGroups.length">
                    <div style="overflow: hidden; height: 18px;" class="ellipsis mx-3"
                         v-html="selectedGroupsList"></div>
                    <v-fab-transition>
                        <v-btn dark absolute top right fab
                               color="secondary"
                               v-show="selectedGroups.length > 0"
                               @click="shareImages">
                            <v-icon>send</v-icon>
                        </v-btn>
                    </v-fab-transition>
                </v-toolbar>
            </transition>
        </v-card>
    </v-dialog>
</template>
<script>
  import QFilter from './QFilter'
  import QPushPhotos from './QPushPhotos'
  import gql from 'graphql-tag'
  import { mapGetters, mapState } from 'vuex'

  export default {
    name: 'ShareDialog',
    components: {QFilter, QPushPhotos},
    data () {
      return {
        loading: 0,
        saveImages: false,
        filterWord: ''
      }
    },
    created () {
      // document.addEventListener('keyup', this.cancel)
    },
    destroyed () {
      // document.removeEventListener('keyup', this.cancel)
    },
    methods: {
      cancel (event) {
        if (event.keyCode === 27 || event.key === 'Escape') {
          this.dialog = false
        }
      },
      selectFiltered () {
        if (this.filterWord === '') {
          return
        }
        this.filteredGroups.forEach(group => { group.selected = true })
      },
      clearSelected () {
        this.filteredGroups.forEach(group => { group.selected = false })
      },
      throttleText (group) {
        if (group.throttleRemaining === undefined) {
          return '∞'
        }
        if (group.throttleCount === 0) {
          return '&mdash;'
        }
        return group.throttleRemaining + '/' + group.throttleCount
      },
      shareImages () {
        this.saveImages = true
      }
    },
    computed: {
      ...mapGetters(['userId']),
      ...mapState(['pool']),
      dialog: {
        get () {
          return this.$store.state.dialog
        },
        set () {
          this.$store.commit('hideDialog')
        }
      },
      filteredGroups () {
        return this.groups.filter(group =>
          group.title.toLowerCase().search(this.filterWord) >= 0 ||
          group.groupId.toLowerCase().search(this.filterWord) >= 0
        )
      },
      selectedGroups () {
        return this.groups.filter(group => group.selected === true)
      },
      selectedGroupsList () {
        return this.selectedGroups.map(group => group.title).join(',&nbsp;')
      }
    },
    apollo: {
      groups: {
        // gql query
        query: gql`query groups($userId: ID!){
  userGroups(userId: $userId) {
    title
    groupId
    icon
    poolCount
    members
    throttleMode
    throttleCount
    throttleRemaining
  }
}`,
        variables () {
          return {
            userId: this.userId
          }
        },
        update: data => data.userGroups.map(group => Object.assign({selected: false}, group)),
        fetchPolicy: 'cache-and-network',
        loadingKey: 'loading'
      }
    }
  }
</script>
<style>
    .selected {
        background: #f5f5f5;
    }
</style>