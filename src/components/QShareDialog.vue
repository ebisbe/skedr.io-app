<template>
    <v-dialog v-model="dialog" persistent scrollable max-width="500px">
        <v-card>
            <v-toolbar dark color="primary">
                <v-btn icon @click.native="closePopUp" dark>
                    <v-icon>close</v-icon>
                </v-btn>
                <v-toolbar-title v-html="title"></v-toolbar-title>
            </v-toolbar>
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
                        <transition-group name="whatsapp">
                            <template v-for="group, key in filteredGroups">
                                <v-list-tile avatar :key="group.title" @click="select(group)"
                                             :class="{selected: group.selected}">
                                    <v-list-tile-action>
                                        <v-checkbox
                                                @click.prevent=""
                                                v-model="group.selected"
                                                hide-details
                                                :disabled="disabled(group)"
                                        ></v-checkbox>
                                    </v-list-tile-action>
                                    <v-list-tile-avatar>
                                        <img :src="group.icon">
                                    </v-list-tile-avatar>
                                    <v-list-tile-content style="border-bottom: 1px solid rgba(0,0,0,.12);">
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
                        </transition-group>
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
                    @loaded="closePopUp"
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
  import { mapGetters } from 'vuex'

  export default {
    name: 'ShareDialog',
    components: {QFilter, QPushPhotos},
    props: {
      pool: {
        type: Array,
        required: true
      }
    },
    data () {
      return {
        saveImages: false,
        filterWord: '',
        groups: []
      }
    },
    mounted () {
      this.saveImages = false
      const groups = localStorage.getObject('groups')
      if (groups !== null) {
        this.groups = groups
      }
    },
    created () {
      // document.addEventListener('keyup', this.cancel)
    },
    destroyed () {
      // document.removeEventListener('keyup', this.cancel)
    },
    methods: {
      select (group) {
        if (!this.disabled(group)) {
          group.selected = !group.selected
        }
      },
      cancel (event) {
        if (event.keyCode === 27 || event.key === 'Escape') {
          this.dialog = false
        }
      },
      selectFiltered () {
        if (this.filterWord === '') {
          return
        }
        this.filteredGroups
          .filter(group => {
            return !this.disabled(group)
          })
          .forEach(group => { group.selected = true })
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
      disabled (group) {
        return group.throttleMode === 'disabled'
      },
      shareImages () {
        this.saveImages = true
      },
      closePopUp () {
        this.dialog = false
        setTimeout(() => {
          this.saveImages = false
          this.clearSelected()
          this.filterWord = ''
        }, 2000)
      }
    },
    computed: {
      ...mapGetters(['userId']),
      dialog: {
        get () {
          return this.$store.state.sharePool.length > 0
        },
        set () {
          this.$store.commit('hideDialog')
        }
      },
      filteredGroups () {
        return this.groups.filter(group =>
          group.title.toLowerCase().search(this.filterWord.toLowerCase()) >= 0 ||
          group.groupId.toLowerCase().search(this.filterWord.toLowerCase()) >= 0
        )
      },
      selectedGroups () {
        return this.groups.filter(group => group.selected === true)
      },
      selectedGroupsList () {
        return this.selectedGroups.map(group => group.title).join(',&nbsp;')
      },
      title () {
        if (this.pool.length === 1) {
          return `Sharing '${this.pool[0].title}'`
        }
        return `Sharing Pool (${this.pool.length} elements)`
      }
    }
  }
</script>
<style>
    .selected {
        background: #f5f5f5;
    }

    .whatsapp-enter-active {
        transition: all .2s;
    }

    .whatsapp-leave-active {
        transition: all .2s;
    }

    .whatsapp-enter {
        opacity: 0;
        transform: translateY(-30px);
    }

    .whatsapp-leave-to {
        opacity: 0;
    }
</style>
