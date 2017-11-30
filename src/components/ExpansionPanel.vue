<template>
    <div>
        <v-layout align-center row spacer @mouseover="mouseOver" @mouseleave="mouseLeave">
            <v-flex xs2 sm1 md1 @click.stop="">
                <v-avatar size="40px" slot="activator" :class="{hidden: hideAvatar}">
                    <img :src="group.icon" :alt="group.title">
                </v-avatar>
                <v-checkbox v-model="group.selected" hide-details
                            :class="{hidden: !hideAvatar, 'pa-1':true}"></v-checkbox>
            </v-flex>
            <v-flex md6 ellipsis><strong v-html="group.title"></strong></v-flex>
            <v-flex md1 text-sm-center>{{ dateAddedFormated }}</v-flex>
            <v-flex md2 text-xs-right hidden-xs-only>{{ group.poolCount }}</v-flex>
            <v-flex md2 text-xs-right hidden-xs-only>{{ group.members }}</v-flex>
            <v-flex xs4 sm2 class="grey--text" text-xs-right>
                <span v-html="throttleText"></span>
                <strong>{{ group.throttleMode }}</strong>
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
        mouseOverAvatar: false
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
        return this.selectedGroups.length > 0 || this.mouseOverAvatar
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
      'group.selected' (isSelected) {
        this.$emit('selected', isSelected)
      }
    },
    methods: {
      mouseOver () {
        this.mouseOverAvatar = true
      },
      mouseLeave () {
        this.mouseOverAvatar = false
      }
    }
  }
</script>
