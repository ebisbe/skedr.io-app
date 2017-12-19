<template>
    <div>
        <v-layout align-center row wrap spacer @mouseover="mouseOver" @mouseleave="mouseLeave">
            <v-flex xs2 sm1 md1 @click.stop="">
                <v-avatar size="40px" v-show="!hideAvatar">
                    <img :src="group.icon" :alt="group.title">
                </v-avatar>
                <v-checkbox v-model="selected" hide-details
                            :class="{hidden: !hideAvatar, 'pa-1':true}"></v-checkbox>
            </v-flex>
            <v-flex d-flex xs10 sm11>
                <v-layout row wrap>
                    <v-flex d-flex xs12 sm6 lg6><strong v-html="group.title" class="break"></strong></v-flex>
                    <v-flex d-flex sm6 lg6>
                        <span>{{ dateAddedFormated }}</span>
                        <v-spacer></v-spacer>
                        <span>{{ group.poolCount }}</span>
                        <v-spacer></v-spacer>
                        <span>{{ group.members }}</span>
                        <v-spacer></v-spacer>
                        <span class="grey--text" text-xs-right>
                                <span v-html="throttleText"></span>
                                <strong>{{ group.throttleMode }}</strong>
                            </span>
                    </v-flex>
                </v-layout>
            </v-flex>
        </v-layout>
    </div>
</template>
<script>
  import { mapState } from 'vuex'
  import Moment from 'moment'

  Moment.updateLocale('en', {
    relativeTime: {
      future: 'in %s',
      past: '%s ago',
      s: '1s',
      ss: '%ds',
      m: '1m',
      mm: '%dm',
      h: '1h',
      hh: '%dh',
      d: '1d',
      dd: '%dd',
      M: '1mo',
      MM: '%dmo',
      y: '1yr',
      yy: '%dyr'
    }
  })

  export default {
    name: 'ExpansionPanel',
    props: {
      group: {required: true}
    },
    data () {
      return {
        mouseOverAvatar: false,
        selected: false
      }
    },
    computed: {
      ...mapState([
        'selectedGroups'
      ]),
      throttleText () {
        if (this.group.throttleRemaining === undefined) {
          return '∞'
        }
        if (this.group.throttleCount === 0) {
          return '&mdash;'
        }
        return this.group.throttleRemaining + '/' + this.group.throttleCount
      },
      hideAvatar () {
        return this.selected || this.mouseOverAvatar
      },
      dateAddedFormated () {
        if (this.group.photos[0].rawDateAdded === undefined) {
          return '-'
        } else {
          return Moment(this.group.photos[0].rawDateAdded).fromNow(true)
        }
      }
    },
    watch: {
      'selected' (isSelected) {
        this.$store.commit('updateSelectedGroups', {group: this.group, isSelected})
      }
    },
    methods: {
      mouseOver () {
        this.mouseOverAvatar = this.group.throttleMode !== 'disabled'
      },
      mouseLeave () {
        this.mouseOverAvatar = false
      }
    }
  }
</script>
<style>
    .break {
        word-break: break-all;
    }
</style>
