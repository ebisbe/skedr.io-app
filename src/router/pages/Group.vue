<template>
    <v-content>
        <v-container fluid grid-list-xl>
            <v-layout row wrap>
                <v-flex xs12>
                    <v-container grid-list-xl>
                        <v-layout row wrap>
                            <v-flex xs12 sm6>
                                <v-text-field label="Filter groups"
                                              v-model="groupFilter"
                                              @keyup.esc="groupFilter=''"
                                              :append-icon="groupFilter === '' ? '' : 'clear'"
                                              :append-icon-cb="() => (groupFilter = '')"
                                ></v-text-field>
                            </v-flex>
                        </v-layout>
                    </v-container>
                    <div class="mx-4">
                        <v-layout align-center row spacer>
                            <v-flex xs3 sm2 md1></v-flex>
                            <v-flex no-wrap ellipsis class="grey--text"><strong>Group name</strong></v-flex>
                            <v-flex md1 text-xs-center hidden-xs-only class="grey--text"><strong>Last addition</strong>
                            </v-flex>
                            <v-flex md2 text-xs-center hidden-xs-only class="grey--text"><strong>Pool count</strong>
                            </v-flex>
                            <v-flex md2 text-xs-center hidden-xs-only class="grey--text"><strong>Members</strong>
                            </v-flex>
                            <v-flex xs4 sm2 class="grey--text" text-xs-center><strong>Throttle</strong></v-flex>
                        </v-layout>
                    </div>
                    <my-fetch url="/groups">
                        <v-expansion-panel popout slot-scope="data">
                            <v-expansion-panel-content
                                    v-for="group in sortAndFilter(data)"
                                    :key="group.name"
                                    v-show="hide(group)"
                                    :class="{'grey lighten-4': group.checked}">
                                <expansion-panel slot="header" :group="group"></expansion-panel>
                                <v-card>
                                    <v-card-text class="grey lighten-3">
                                        <my-fetch :url="group.photosUrl">
                                            <v-layout row wrap slot-scope="data">
                                                <v-flex md3 sm4 xs6
                                                        v-for="photo in data.photo"
                                                        :key="photo.id">
                                                    <photo :photo="photo"></photo>
                                                </v-flex>
                                            </v-layout>
                                        </my-fetch>
                                    </v-card-text>
                                </v-card>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </my-fetch>
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
                <v-dialog v-model="dialog" :fullscreen="!addingPhotosToGroup" transition="dialog-bottom-transition">
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
                            <v-list subheader>
                                <v-subheader>Selected groups</v-subheader>
                                <v-list-tile avatar v-for="group in selectedGroups" :key="group.title">
                                    <v-list-tile-avatar>
                                        <img :src="urlGroup(group)"/>
                                    </v-list-tile-avatar>
                                    <v-list-tile-content>
                                        <v-list-tile-title v-html="group.name"></v-list-tile-title>
                                    </v-list-tile-content>
                                </v-list-tile>
                            </v-list>
                            Confirming will add all the photos to each group and schedule all the ones can not be
                            added.
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn class="green--text darken-1" flat="flat" @click.native="dialog = false">Disagree
                            </v-btn>
                            <v-btn class="green--text darken-1" flat="flat" @click.native="pushPhotosToGroups()">Agree
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
  import * as _ from 'lodash'
  import { mapGetters, mapState } from 'vuex'
  import { signReq } from '../../libs/aws-lib'
  import { url } from '../../mixins/urlPhoto'

  export default {
    name: 'Group',
    components: {ExpansionPanel, Photo},
    mixins: [url],
    data () {
      return {
        dialog: false,
        confirm: false,
        hover: false,
        photosSearch: '',
        photos: [],
        status: '',
        data: [],
        error: ''
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
      }
    },
    watch: {
      groupFilter: function (filter) {
        localStorage.setItem('groupFilter', filter)
      }
    },
    methods: {
      pushPhotosToGroups () {
        console.log('Pushing photos')
        _.forEach(this.selectedGroups, (group) => {
          _.forEach(this.pool, async (photo) => {
            await this.axios(
              signReq('/pool', '', {
                photoId: photo.id,
                groupId: group.nsid,
                secret: photo.secret
              }, 'post')
            ).then((response) => {
            })
          })
        })
        this.dialog = false
      },
      hide (group) {
        return group.name.toLowerCase().search(this.groupFilter) >= 0
      },
      sortAndFilter (group) {
        return _.sortBy(group, ['name'])
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