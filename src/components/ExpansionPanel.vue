<template>
    <div>
        <v-layout align-center row spacer @click="fetchGroupPhotos()">
            <v-flex xs3 sm2 md1 @click.stop="" @mouseover="mouseOver()" @mouseleave="mouseLeave()">
                <v-avatar size="40px" slot="activator" :class="{hidden: hideAvatar}">
                    <img :src="urlGroup(group)" :alt="group.name">
                </v-avatar>
                <v-checkbox v-model="checked" hide-details @click="checkBoxClick()"
                            :class="{hidden: !hideAvatar, 'pa-1':true}"></v-checkbox>
            </v-flex>
            <v-flex no-wrap ellipsis>
                <strong>{{ group.name }}</strong>
            </v-flex>
            <v-flex md1 text-sm-center>
                {{ dateAddedFormated }}
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
                <span v-html="throttleText"></span>
                <strong>{{ group.throttle.mode }}</strong>
            </v-flex>
        </v-layout>
    </div>
</template>
<script>
  import { url } from '../mixins/urlPhoto'
  import { mapState } from 'vuex'
  import Flickr from 'flickr-sdk'
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
    mixins: [url],
    props: {
      group: {required: true}
    },
    created () {
      let flickr = new Flickr('78ab8d949e94be81d67730224abbcdb1')
      flickr.groups.pools.getPhotos({
        page: 1,
        per_page: 1,
        group_id: this.group.nsid
      })
        .then((response) => {
          this.$set(this.group, 'dateadded', response.body.photos.photo[0].dateadded)
        })
    },
    data () {
      return {
        mouseOverAvatar: false,
        checked: false
      }
    },
    computed: {
      ...mapState([
        'selectedGroups'
      ]),
      throttleText () {
        if (this.group.throttle.remaining === undefined) {
          return '∞'
        }
        if (this.group.throttle.count === 0) {
          return '&mdash;'
        }
        return this.group.throttle.remaining + '/' + this.group.throttle.count
      },
      hideAvatar () {
        return this.selectedGroups.length > 0 || this.mouseOverAvatar
      },
      dateAddedFormated () {
        if (this.group.dateadded === undefined) {
          return '-'
        } else {
          return Moment.unix(this.group.dateadded).fromNow(true)
        }
      }
    },
    methods: {
      mouseOver () {
        this.mouseOverAvatar = true
      },
      mouseLeave () {
        this.mouseOverAvatar = false
      },
      checkBoxClick () {
        this.checked = !this.checked
        if (this.checked) {
          this.$set(this.group, 'checked', this.checked)
          this.$store.commit('addToGroup', {group: this.group, add: this.checked})
        } else {
          this.$store.commit('addToGroup', {group: this.group, add: this.checked})
          this.$set(this.group, 'checked', this.checked)
        }
      },
      fetchGroupPhotos () {
        if (!this.group.hasOwnProperty('photosUrl')) {
          this.$set(this.group, 'photosUrl', '/groups/pool/' + this.group.nsid)
        }
      }
    }
  }
</script>