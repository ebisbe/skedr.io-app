<template>
    <v-content>
        <v-container fluid grid-list-xl>
            <v-layout row wrap>
                <v-flex xs12>
                    <v-card>
                        <v-card-title>
                            <v-spacer></v-spacer>
                            <v-text-field
                                    append-icon="search"
                                    label="Search"
                                    single-line
                                    hide-details
                                    v-model="search"
                            ></v-text-field>
                            <v-text-field label="Filter groups"
                                          v-model="groupFilter"
                                          @keyup.esc="groupFilter=''"
                                          :append-icon="groupFilter === '' ? '' : 'clear'"
                                          :append-icon-cb="() => (groupFilter = '')"
                            ></v-text-field>

                        </v-card-title>
                        <v-data-table
                                :headers="headers"
                                :items="groups"
                                :search="search"
                                :loading="isLoading()"
                                v-model="selected"
                                select-all
                                item-key="title"
                        >
                            <template slot="items" scope="props">
                                <row :data="props"></row>
                            </template>
                            <template slot="expand" scope="props">
                                <v-card flat>
                                    <v-card-text>Peek-a-boo!</v-card-text>
                                </v-card>
                            </template>
                            <template slot="pageText" scope="{ pageStart, pageStop }">
                                From {{ pageStart }} to {{ pageStop }}
                            </template>
                        </v-data-table>
                    </v-card>
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
                                            <v-text-field label="Text" v-model="photosSearch"
                                                          @keyup.esc.prevent.stop="photosSearch=''"
                                                          :append-icon="photosSearch === '' ? '' : 'clear'"
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
  import Row from '../../components/Row.vue'
  import Photo from '../../components/Photo.vue'
  import GroupView from '../../components/GroupView.vue'
  import * as _ from 'lodash'
  import { mapGetters, mapState } from 'vuex'
  import { signReq } from '../../libs/aws-lib'
  import { url } from '../../mixins/urlPhoto'
  import gql from 'graphql-tag'

  export default {
    name: 'Group',
    components: {Photo, GroupView, Row},
    mixins: [url],
    data () {
      return {
        dialog: false,
        photosSearch: '',
        groups: [],
        error: '',
        loading: 0,
        search: '',
        pagination: {},
        headers: [
          {text: '', sortable: false},
          {
            text: 'Group name',
            align: 'left',
            value: 'title'
          },
          {text: 'Last addition', value: 'photos[0].rawDateAdded'},
          {text: 'Pool count', value: 'poolCount'},
          {text: 'Members', value: 'members'},
          {text: 'Throttle', value: 'throttleRemaining'}
        ]
      }
    },
    created () {
      this.groupFilter = localStorage.getItemDef('groupFilter', '')
      this.$store.commit('setPageTitle', 'Group')

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
        'groupFilter'
      ]),
      searchImages () {
        if (this.photosSearch === '') {
          return ''
        }
        return '/search'
      },
      groupFilter: {
        get () {
          return this.$store.state.groupFilter
        },
        set (value) {
          this.$store.commit('updateGroupFilter', value)
        }
      },
      selected: {
        get () {
          return this.$store.state.selectedGroups
        },
        set (value) {
          this.$store.commit('selectedGroups', {groups: value})
        }
      }
    },
    watch: {
      groupFilter: function (filter) {
        localStorage.setItem('groupFilter', filter)
      }
    },
    methods: {
      isLoading () {
        return this.loading === 1
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
            ).then((response) => {
            })
          })
        })
        this.dialog = false
      },
      hide (group) {
        return group.title.toLowerCase().search(this.groupFilter) >= 0
      },
      sortAndFilter (group) {
        return _.sortBy(group, ['title'])
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
        update: data => data.userGroups,
        fetchPolicy: 'cache-and-network',
        loadingKey: 'loading'
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