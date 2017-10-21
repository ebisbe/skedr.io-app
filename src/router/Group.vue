<template>
    <v-content>
        <v-container fluid grid-list-xl>
            <v-layout row wrap>
                <v-flex md9 xs12>
                    <v-container grid-list-xl>
                        <v-layout row wrap>
                            <v-flex xs12 sm6>
                                <h1 class="display-1">Groups</h1>
                            </v-flex>
                            <v-flex xs12 sm6>
                                <v-text-field label="Filter groups" v-model="filter"></v-text-field>
                            </v-flex>
                        </v-layout>
                    </v-container>
                    <my-fetch url="http://localhost:3000/groups">
                        <v-expansion-panel popout slot-scope="data">
                            <v-expansion-panel-content
                                    v-for="group in data"
                                    :key="group.name"
                                    v-show="!group.hidden">
                                <div slot="header">
                                    <v-layout align-center row spacer @click="fetchGroupPhotos(group)">
                                        <v-flex xs3 sm2 md1 @click.stop=""
                                                @mouseover="mouseOver(group)"
                                                @mouseleave="mouseLeave(group)"
                                        >
                                            <v-avatar size="40px" slot="activator"
                                                      :class="{hidden: group.avatarHidden}">
                                                <img :src="urlGroup(group)"
                                                     :alt="group.name">
                                            </v-avatar>
                                            <v-checkbox
                                                    v-model="group.checked"
                                                    hide-details
                                                    @click="checkBoxClick(group)"
                                                    :class="{hidden: !group.avatarHidden, 'pa-1':true}"></v-checkbox>
                                        </v-flex>
                                        <v-flex no-wrap ellipsis>
                                            <strong>{{ group.name }}</strong>
                                        </v-flex>
                                        <v-flex md2 text-sm-right hidden-xs-only>
                                            {{ group.pool_count }}
                                            <v-icon>photo</v-icon>
                                        </v-flex>
                                        <v-flex md2 text-sm-right hidden-xs-only>
                                            {{ group.members }}
                                            <v-icon>face</v-icon>
                                        </v-flex>
                                        <v-flex xs4 sm2 class="grey--text" text-xs-right>
                                            <span v-html="throttle(group.throttle)"></span>
                                            <strong>{{ group.throttle.mode }}</strong>
                                        </v-flex>
                                    </v-layout>
                                </div>
                                <v-card>
                                    <v-progress-linear :indeterminate="true"
                                                       v-show="!group.hasOwnProperty('photos')"
                                                       class="ma-0"></v-progress-linear>
                                    <v-card-text class="grey lighten-3">
                                        <v-container grid-list-md>
                                            <v-layout row wrap>
                                                <v-flex md3 sm4 xs6 v-for="photo in group.photos" :key="photo.id">
                                                    <photo :photo="photo"></photo>
                                                </v-flex>
                                            </v-layout>
                                        </v-container>
                                    </v-card-text>
                                </v-card>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </my-fetch>
                </v-flex>
                <v-flex md3 xs12>
                    <h2 class="display-1 ma-3">Scheduled photos</h2>
                    <v-progress-linear :indeterminate="true" v-if="scheduled.length === 0"
                                       class="ma-0"></v-progress-linear>
                    <v-list two-line v-else>
                        <template v-for="(item, index) in scheduled">
                            <v-subheader v-text="headerDate(index)"></v-subheader>
                            <template v-for="(photo, iteration) in item">
                                <v-divider v-show="iteration !== 0" inset></v-divider>
                                <photo-list :photo="photo"></photo-list>
                            </template>
                        </template>
                    </v-list>
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
                                        <form @submit.stop.prevent="searchPhotos()">
                                            <v-text-field label="Text" v-model="photosSearch"></v-text-field>
                                        </form>
                                    </v-flex>
                                    <v-flex v-show="searching" xs12>
                                        <v-progress-linear v-bind:indeterminate="true"></v-progress-linear>
                                    </v-flex>
                                    <transition-group name="list" tag="div" class="layout wrap">
                                        <v-flex v-show="!searching" md3 sm4 xs6 v-for="photo in photos" :key="photo.id">
                                            <photo :photo="photo"></photo>
                                        </v-flex>
                                    </transition-group>
                                </v-layout>
                            </v-container>
                        </v-card-text>

                    </v-card>
                    <v-card v-else>
                        <v-card-title class="headline">Add photos to selected groups?</v-card-title>
                        <v-card-text>
                            <ul>
                                <li v-for="group in this.$store.state.groups" v-if="group.checked"
                                    v-html="group.name"></li>
                            </ul>
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
  import { url } from '../mixins/urlPhoto'
  import { expansionPanel } from '../mixins/expansionPanel'
  import photo from '../components/Photo.vue'
  import photoList from '../components/PhotoList.vue'
  import * as _ from 'lodash'
  import * as moment from 'moment'
  import { mapGetters, mapState } from 'vuex'

  export default {
    name: 'Group',
    mixins: [url, expansionPanel],
    components: {photo, photoList},
    data () {
      return {
        dialog: false,
        confirm: false,
        hover: false,
        photosSearch: '',
        searching: false,
        photos: [],
        scheduled: [],
        status: '',
        data: [],
        error: ''
      }
    },
    created () {
      this.fetchScheduledPhotos()
    },
    computed: {
      ...mapGetters([
        'activeFab',
        'addingPhotosToGroup'
      ]),
      ...mapState([
        'pool'
      ])
    },
    methods: {
      fetchScheduledPhotos () {
        this.axios.get('/scheduled')
          .then((response) => {
            this.scheduled = _.groupBy(response.data, 'scheduledAt')
          })
      },
      pushPhotosToGroups () {
        let matches = _.filter(this.$store.state.groups, {checked: true})
        _.forEach(matches, (group) => {
          _.forEach(this.$store.state.pool, (photo) => {
            this.axios.post('/pool', {
              photoId: photo.id,
              groupId: group.nsid,
              secret: photo.secret
            }).then((response) => {
              this.scheduled = []
              this.fetchScheduledPhotos()
            })
          })
        })
        this.dialog = false
      },
      headerDate (index) {
        return moment(parseInt(index)).calendar(null, {
          nextDay: '[Tomorrow]',
          nextWeek: 'dddd, Do',
          sameElse: 'DD-MM-YYYY'
        })
      },
      searchPhotos () {
        this.searching = true
        this.axios.post('search', {text: this.photosSearch})
          .then((response) => {
            this.photos = response.data.photo
            this.searching = false
          })
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