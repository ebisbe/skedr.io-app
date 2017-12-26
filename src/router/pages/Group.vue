<template>
    <v-content>
        <v-progress-linear height="3" class="my-0" v-bind:indeterminate="true" v-if="loading"></v-progress-linear>
        <v-container fluid grid-list-sm>
            <v-layout row wrap>
                <v-flex xs12>
                    <v-layout align-center row spacer ml-3 mr-5>
                        <v-flex xs2 sm1 md1>&nbsp;</v-flex>
                        <v-flex d-flex xs10 sm11>
                            <v-layout row wrap>
                                <v-flex d-flex xs12 sm6 lg6><strong>Group name</strong></v-flex>
                                <v-flex d-flex sm6 lg6>
                                    <v-layout row>
                                        <span>
                                            <v-tooltip bottom>
                                                <v-icon slot="activator">alarm</v-icon>
                                                <span>Last addition</span>
                                            </v-tooltip>
                                        </span>
                                        <v-spacer></v-spacer>
                                        <span>
                                            <v-tooltip bottom>
                                                <v-icon slot="activator">photo</v-icon>
                                                <span>Pool count</span>
                                            </v-tooltip>
                                        </span>
                                        <v-spacer></v-spacer>
                                        <span>
                                            <v-tooltip bottom>
                                                <v-icon slot="activator">face</v-icon>
                                                <span>Members</span>
                                            </v-tooltip>
                                        </span>
                                        <v-spacer></v-spacer>
                                        <span class="grey--text">
                                            <strong>Throttle</strong>
                                        </span>
                                    </v-layout>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                </v-flex>

                <v-expansion-panel popout>
                    <v-expansion-panel-content
                            v-for="group in filteredGroups"
                            :key="group.title"
                            v-model="group.expanded"
                            :class="{'grey lighten-3': group.selected}">
                        <expansion-panel slot="header" :group="group"></expansion-panel>
                        <v-card>
                            <v-card-text class="grey lighten-3">
                                <group-view
                                        v-if="group.expanded"
                                        :groupId="group.groupId"
                                        @isLoading="isLoading"
                                ></group-view>
                            </v-card-text>
                        </v-card>
                    </v-expansion-panel-content>
                </v-expansion-panel>
                </v-flex>
                <v-tooltip left>
                    <v-fab-transition slot="activator">
                        <v-btn :class="[activeFab.class]" dark fab bottom right fixed
                               :key="activeFab.icon"
                               @click.native.stop="dialog = true">
                            <v-icon>{{ activeFab.icon }}</v-icon>
                        </v-btn>
                    </v-fab-transition>
                    <span>{{ activeFab.html }}</span>
                </v-tooltip>
                <v-dialog v-model="dialog" :fullscreen="!addingPhotosToGroup" :scrollable="addingPhotosToGroup"
                          transition="dialog-bottom-transition">
                    <v-card v-if="!addingPhotosToGroup">
                        <v-toolbar dark :class="[activeFab.class, 'lighten-1']">
                            <v-btn icon @click.native="dialog = false" dark>
                                <v-icon>close</v-icon>
                            </v-btn>
                            <v-toolbar-title>Search photos</v-toolbar-title>
                            <v-spacer></v-spacer>
                            <v-toolbar-items>
                                <q-pool-btn></q-pool-btn>
                            </v-toolbar-items>
                        </v-toolbar>
                        <v-card-text>
                            <v-container grid-list-md>
                                <v-layout wrap>
                                    <v-flex xs12>
                                        <form @submit.stop.prevent="">
                                            <v-text-field placeholder="Search your photos..." v-model="photosSearch"
                                                          @keyup.esc.prevent.stop="photosSearch=''"
                                                          :append-icon="photosSearch === '' ? 'search' : 'clear'"
                                                          :append-icon-cb="() => (photosSearch = '')">
                                            </v-text-field>
                                        </form>
                                    </v-flex>
                                    <my-fetch :url="searchImages" method="post" :data="{text: photosSearch}">
                                        <transition-group name="list" tag="div" class="layout wrap" slot-scope="data">
                                            <v-flex md3 sm4 xs6 v-for="photo in data.photo" :key="photo.id">
                                                <photo :photo="photo"></photo>
                                            </v-flex>
                                        </transition-group>
                                    </my-fetch>
                                </v-layout>
                            </v-container>
                        </v-card-text>

                    </v-card>
                    <q-push-photos
                            v-else
                            @photosPushed="dialog=false"
                            @cancel="dialog=false"
                    ></q-push-photos>
                </v-dialog>
            </v-layout>
        </v-container>
    </v-content>
</template>

<script>
  import ExpansionPanel from '../../components/ExpansionPanel.vue'
  import Photo from '../../components/Photo.vue'
  import GroupView from '../../components/GroupView.vue'
  import * as _ from 'lodash'
  import { mapGetters, mapState } from 'vuex'
  import gql from 'graphql-tag'
  import QPoolBtn from '../../components/QPoolBtn.vue'
  import QPushPhotos from '../../components/QPushPhotos'

  export default {
    name: 'Group',
    components: {ExpansionPanel, Photo, GroupView, QPoolBtn, QPushPhotos},
    data () {
      return {
        dialog: false,
        confirm: false,
        photosSearch: '',
        status: '',
        error: '',
        loading: false
      }
    },
    created () {
      this.groups = localStorage.getObject('groups')
      document.addEventListener('keyup', event => {
        if (event.keyCode === 27 || event.key === 'Escape') {
          this.dialog = false
        }
      })
    },
    computed: {
      ...mapGetters([
        'activeFab',
        'addingPhotosToGroup',
        'userId'
      ]),
      ...mapState([
        'search'
      ]),
      searchImages () {
        if (this.photosSearch === '') {
          return ''
        }
        return 'search'
      },
      filteredGroups () {
        return this.groups.filter(group =>
            group.title.toLowerCase().search(this.search) >= 0 ||
            group.groupId.toLowerCase().search(this.search) >= 0
          )
      }
    },
    methods: {
      isLoading (loading) {
        this.loading = loading
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
    photos(first: 1) {
      rawDateAdded
      dateAdded
    }
  }
}`,
        variables () {
          return {
            userId: this.userId
          }
        },
        update: data => _.sortBy(data.userGroups.map(group => Object.assign({selected: false, expanded: false}, group)), ['title']),
        fetchPolicy: 'cache-and-network',
        loadingKey: 'loading'
      }
    },
    watch: {
      groups (groups) {
        localStorage.setObject('groups', groups)
      }
    }
  }
</script>
<style>
    .hidden {
        display: none !important;
    }

    .list-item {
        display: inline-block;
        margin-right: 10px;
    }

    .list-enter-active, .list-leave-active {
        transition: all 1s;
    }

    .list-enter, .list-leave-to /* .list-leave-active below version 2.1.8 */
    {
        opacity: 0;
        transform: translateY(30px);
    }
</style>
