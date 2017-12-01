<template>
    <v-content>
        <v-container fluid grid-list-xl>
            <v-layout row wrap>
                <v-flex xs12>
                    <v-layout align-center row spacer mx-3>
                        <v-flex xs3 sm2 md1>&nbsp;</v-flex>
                        <v-flex md5 ellipsis class="grey--text"><strong>Group name</strong></v-flex>
                        <v-flex md2 text-xs-center hidden-xs-only class="grey--text">
                          <v-tooltip bottom>
                              <v-icon slot="activator">alarm</v-icon>
                              <span>Last addition</span>
                          </v-tooltip>
                        </v-flex>
                        <v-flex md2 text-xs-center hidden-xs-only class="grey--text">
                              <v-tooltip bottom>
                                  <v-icon slot="activator">photo</v-icon>
                                  <span>Pool count</span>
                              </v-tooltip>
                        </v-flex>
                        <v-flex md2 text-xs-center hidden-xs-only class="grey--text">
                          <v-tooltip bottom>
                              <v-icon slot="activator">face</v-icon>
                              <span>Members</span>
                          </v-tooltip>
                        </v-flex>
                        <v-flex xs4 sm2 class="grey--text" text-xs-center><strong>Throttle</strong></v-flex>
                    </v-layout>
                    <v-expansion-panel popout>
                        <v-expansion-panel-content
                                v-for="group in filteredGroups"
                                :key="group.title"
                                v-model="group.expanded"
                                :class="{'grey lighten-4': group.checked}">
                            <expansion-panel slot="header" :group="group"></expansion-panel>
                            <v-progress-linear indeterminate height="3"
                                               v-show="group.expanded && loading"
                                               class="my-0"></v-progress-linear>
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
                                <v-btn flat
                                       @click.stop="$store.commit('updateRightDrawer', true)"
                                       class="deep-purple ligthen-2"
                                >
                                    Photo pool&nbsp;&nbsp;
                                    <v-badge overlap color="red">
                                        <span slot="badge">{{ pool.length }}</span>
                                        <v-icon>filter</v-icon>
                                    </v-badge>
                                </v-btn>
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
                    <v-card v-else>
                        <v-card-title class="headline">Add photos to selected groups?</v-card-title>
                        <v-card-text>
                            Confirming will add all the photos to each group and schedule all the ones can not be
                            added.
                            <v-list subheader>
                                <v-list-tile avatar v-for="group in selectedGroups" :key="group.title">
                                    <v-list-tile-avatar>
                                        <img :src="group.icon"/>
                                    </v-list-tile-avatar>
                                    <v-list-tile-content>
                                        <v-list-tile-title v-html="group.title"></v-list-tile-title>
                                    </v-list-tile-content>
                                </v-list-tile>
                            </v-list>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn class="green--text darken-1" flat="flat" @click.native="dialog = false">Cancel
                            </v-btn>
                            <v-btn class="green--text darken-1" flat="flat" @click.native="pushPhotosToGroups()">OK
                            </v-btn>
                        </v-card-actions>
                    </v-card>
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
  import { signReq } from '../../libs/aws-lib'
  import gql from 'graphql-tag'

  export default {
    name: 'Group',
    components: {ExpansionPanel, Photo, GroupView},
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
        'addingPhotosToGroup'
      ]),
      ...mapState([
        'userId',
        'pool',
        'selectedGroups',
        'search'
      ]),
      searchImages () {
        if (this.photosSearch === '') {
          return ''
        }
        return '/search'
      },
      filteredGroups () {
        return _.sortBy(this.groups, ['title'])
          .filter(group =>
            group.title.toLowerCase().search(this.search) >= 0
          )
      }
    },
    methods: {
      isLoading (loading) {
        this.loading = loading
      },
      pushPhotosToGroups () {
        console.log('Pushing photos')
        _.forEach(this.selectedGroups, (group) => {
          _.forEach(this.pool, async (photo) => {
            await this.axios(
              signReq('/pool', '', {
                /** BACKWARDS COMPATIBILITY **/
                photoId: photo.photoId !== undefined ? photo.photoId : photo.id,
                /** END **/
                groupId: group.groupId,
                secret: photo.secret
              }, 'post')
            )
              .then((response) => console.log(response))
              .catch(error => console.log(error))
          })
        })
        this.dialog = false
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
        update: data => data.userGroups.map(group => Object.assign({selected: false, expanded: false}, group)),
        fetchPolicy: 'cache',
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
