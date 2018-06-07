<template>
  <div>
    <v-list-tile
      avatar
      ripple>
      <v-list-tile-avatar>
        <img :src="group.icon" :alt="group.title">
      </v-list-tile-avatar>
      <v-list-tile-content v-if="$vuetify.breakpoint.mdAndUp">
        <v-list-tile-title>
          <v-layout row wrap>
            <v-flex xs6 v-html="group.title"/>
            <v-flex xs2 class="text-xs-right">{{ group.poolCount }} <v-icon slot="activator">photo</v-icon></v-flex>
            <v-flex xs2 class="text-xs-right">{{ group.members }} <v-icon slot="activator">face</v-icon></v-flex>
            <v-flex xs2 class="grey--text text-xs-right">
              <span v-html="throttleText"/>&nbsp;
              <strong>{{ group.throttleMode }}</strong>
            </v-flex>
          </v-layout>
        </v-list-tile-title>
      </v-list-tile-content>
      <v-list-tile-content v-if="$vuetify.breakpoint.smAndDown">
        <v-list-tile-title v-html="group.title"/>
        <v-list-tile-sub-title>
          <v-layout row wrap>
            <v-flex xs4 class="text-xs-right">{{ group.poolCount }} <v-icon slot="activator">photo</v-icon></v-flex>
            <v-flex xs4 class="text-xs-right">{{ group.members }} <v-icon slot="activator">face</v-icon></v-flex>
            <v-flex xs4 class="grey--text text-xs-right">
              <span v-html="throttleText"/>&nbsp;
              <strong>{{ group.throttleMode }}</strong>
            </v-flex>
          </v-layout>
        </v-list-tile-sub-title>
      </v-list-tile-content>
      <v-list-tile-action>
        <v-list-tile-action-text>{{ dateAddedFormated }}</v-list-tile-action-text>
        <v-btn
          :disabled="disabled"
          icon
          ripple
          flat
          @click.stop="share">
          <v-icon color="grey lighten-1">share</v-icon>
        </v-btn>
      </v-list-tile-action>
      <v-list-tile-action>
        <v-btn
          icon
          ripple
          flat
          @click.stop="$router.push({name: 'Group View', params: { groupId: group.groupId, title: group.title} })">
          <v-icon color="grey lighten-1">arrow_forward</v-icon>
        </v-btn>
      </v-list-tile-action>
      <!--  -->
    </v-list-tile>
    <v-divider v-if="!lastItem" />
  </div>
</template>
<script>
import Moment from 'moment'
import { mapGetters } from 'vuex'
import groupsPayload from '../mixins/groupsPayload'

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
  name: 'QGroupList',
  mixins: [groupsPayload],
  props: {
    group: {
      type: Object,
      required: true
    },
    lastItem: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters({
      poolLength: 'pool/length'
    }),
    disabled() {
      return this.poolLength === 0
    },
    link() {
      return 'https://www.flickr.com/groups/' + this.group.groupId
    },
    throttleText() {
      if (this.group.throttleRemaining === undefined) {
        return '∞'
      }
      if (this.group.throttleCount === 0) {
        return '&mdash;'
      }
      return this.group.throttleRemaining + '/' + this.group.throttleCount
    },
    dateAddedFormated() {
      if (
        this.group.photos === undefined ||
        this.group.photos === null ||
        this.group.photos.length === 0 ||
        this.group.photos[0].rawDateAdded === undefined
      ) {
        return '-'
      } else {
        return Moment(this.group.photos[0].rawDateAdded).fromNow(true)
      }
    }
  },
  methods: {
    share() {
      this.$emit('share', { payload: this.constructPayload([this.group]) })
    }
  }
}
</script>
<style lang="css">
.break {
  word-break: break-all;
}
</style>
