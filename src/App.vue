<template>
    <v-app light toolbar footer>
        <v-toolbar fixed :class="[activeFab.class]" dark>
            <v-toolbar-side-icon></v-toolbar-side-icon>

            <v-toolbar-title v-text="title"></v-toolbar-title>
            <v-spacer></v-spacer>
            <div v-show="addingPhotosToGroup" class="title">{{ $store.state.selectedGroups }} groups selected</div>
            <v-spacer></v-spacer>
            <v-toolbar-items>
                <v-btn flat
                       @click.stop="rightDrawer = !rightDrawer"

                       class="mr-4 deep-purple ligthen-2"
                >
                    Photo pool&nbsp;&nbsp;
                    <v-icon v-badge="{ value: $store.state.pool.length , overlap:true, class: 'red-lighten-3'}">filter
                    </v-icon>
                </v-btn>
            </v-toolbar-items>
        </v-toolbar>
        <main>
            <v-container fluid grid-list-xs>
                <router-view></router-view>
            </v-container>
        </main>

        <v-navigation-drawer temporary right v-model="rightDrawer">
            <v-list>
                <v-list-tile>
                    <v-list-tile-action>
                        <v-icon light>inbox</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-title>Photo pool</v-list-tile-title>
                </v-list-tile>
            </v-list>

            <v-container fluid grid-list-md>
                <transition-group name="list" tag="div" class="layout wrap row">
                    <v-flex xs6 v-for="photo in $store.state.pool" :key="photo.id">
                        <v-card tile>
                            <v-card-media :src="photo.url_m" height="150px">
                                <v-btn class="gray darken-2" small light fab
                                       @click.native.stop="$store.commit('addToPool', {photo: photo, add: false})">
                                    <v-icon>close</v-icon>
                                </v-btn>
                            </v-card-media>
                        </v-card>
                    </v-flex>
                </transition-group>
            </v-container>
        </v-navigation-drawer>

        <v-fab-transition>
            <v-btn :class="[activeFab.class]" dark fab bottom right fixed
                   :key="activeFab.icon"
                   @click.native.stop="dialog = true"
                   v-tooltip:left="buttonToolTip">
                <v-icon>{{ activeFab.icon }}</v-icon>
            </v-btn>
        </v-fab-transition>

        <v-dialog v-model="dialog" :fullscreen="!addingPhotosToGroup" transition="dialog-bottom-transition"
                  :overlay="false">
            <v-card :class="{hidden: addingPhotosToGroup}">
                <v-toolbar dark :class="[activeFab.class, 'lighten-1']">
                    <v-btn icon @click.native="dialog = false" dark>
                        <v-icon>close</v-icon>
                    </v-btn>
                    <v-toolbar-title>Search photos</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-toolbar-items>
                        <v-btn flat
                               @click.stop="rightDrawer = !rightDrawer"
                               class="mr-4 deep-purple ligthen-2"
                        >
                            Photo pool&nbsp;&nbsp;
                            <v-icon v-badge="{ value: $store.state.pool.length , overlap:true, class: 'red-lighten-3'}">
                                filter
                            </v-icon>
                        </v-btn>
                        <v-btn dark flat @click.native="dialog = false">Close</v-btn>
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
            <v-card :class="{hidden: !addingPhotosToGroup}">
                <v-card-title class="headline">Add photos to selected groups?</v-card-title>
                <v-card-text>
                    <ul>
                        <li v-for="group in this.$store.state.groups" v-if="group.checked" v-html="group.name"></li>
                    </ul>
                    Confirming will add all the photos to each group and schedule all the ones can not be
                    added.
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn class="green--text darken-1" flat="flat" @click.native="dialog = false">Disagree</v-btn>
                    <v-btn class="green--text darken-1" flat="flat" @click.native="pushPhotosToGroups()">Agree</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-footer>
            <span>&copy; 2017</span>
        </v-footer>
    </v-app>
</template>

<script>
  import photo from './components/Photo'

  export default {
    name: 'app',
    components: {photo},
    data () {
      return {
        title: 'Layout',
        rightDrawer: false,
        dialog: false,
        photos: [],
        photosSearch: '',
        searching: false
      }
    },
    methods: {
      searchPhotos () {
        this.searching = true
        this.axios.post('search', {text: this.photosSearch})
          .then((response) => {
            this.photos = response.data.photo
            this.searching = false
          })
      }
    },
    computed: {
      activeFab () {
        if (this.addingPhotosToGroup) {
          return {'class': 'deep-orange', icon: 'add_to_photos'}
        } else {
          return {'class': 'deep-purple', icon: 'add_a_photo'}
        }
      },
      buttonToolTip () {
        if (this.addingPhotosToGroup) {
          return {html: 'Add photos to group'}
        } else {
          return {html: 'Search photos'}
        }
      },
      addingPhotosToGroup () {
        return this.$store.state.selectedGroups > 0
      }
    }
  }
</script>
