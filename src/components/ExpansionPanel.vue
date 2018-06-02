<template>
  <div>
    <v-list-tile
      avatar
      ripple
      @click.stop="$router.push({name: 'Group View', params: { groupId: group.groupId, title: group.title} })">
      <v-list-tile-avatar>
        <img :src="group.icon" :alt="group.title">
      </v-list-tile-avatar>
      <v-list-tile-content v-if="$vuetify.breakpoint.mdAndUp">
        <v-list-tile-title>
          <v-layout row wrap>
            <v-flex d-flex>
              <span style="width:200px;" v-html="group.title"/>
              <v-spacer/>
              <span class="text-xs-right">{{ group.poolCount }} <v-icon slot="activator">photo</v-icon></span>
              <span class="text-xs-right">{{ group.members }} <v-icon slot="activator">face</v-icon></span>
              <span
                class="grey--text text-xs-right"
                text-xs-right>
                <span v-html="throttleText"/>
                <strong>{{ group.throttleMode }}</strong>
              </span>
            </v-flex>
          </v-layout>
        </v-list-tile-title>
      </v-list-tile-content>
      <v-list-tile-content v-if="$vuetify.breakpoint.smAndDown">
        <v-list-tile-title v-html="group.title"/>
        <v-list-tile-sub-title>
          <v-layout row wrap>
            <v-flex d-flex>
              <span>{{ group.poolCount }}</span>
              <span>{{ group.members }}</span>
              <span
                class="grey--text"
                text-xs-right>
                <span v-html="throttleText"/>
                <strong>{{ group.throttleMode }}</strong>
              </span>
            </v-flex>
          </v-layout>
        </v-list-tile-sub-title>
      </v-list-tile-content>
      <v-list-tile-action>
        <v-list-tile-action-text>{{ dateAddedFormated }}</v-list-tile-action-text>
        <v-btn
          icon
          ripple
          flat
          @click.stop="share">
          <v-icon color="grey lighten-1">share</v-icon>
        </v-btn>
      </v-list-tile-action>
      <v-dialog v-model="dialog" max-width="500px">
        <v-card>
          <v-toolbar dark color="primary">
            <v-toolbar-title v-html="title"/>
          </v-toolbar>
          <q-push
            v-if="dialog"
            :requests="constructPayload([group])"
            @loaded="closePopUp"
          />
        </v-card>
      </v-dialog>
    </v-list-tile>
    <v-divider />
  </div>
</template>
<script>
import Moment from 'moment'
import { mapGetters } from 'vuex'
import QPush from './QPush'
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
  name: 'ExpansionPanel',
  components: { QPush },
  mixins: [groupsPayload],
  props: {
    group: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      dialog: false
    }
  },
  computed: {
    ...mapGetters({
      poolLength: 'pool/length'
    }),
    disabled() {
      return this.poolLength === 0
    },
    title() {
      return `Sharing Pool (${this.poolLength} elements)`
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
      if (this.group.photos.length === 0 || this.group.photos[0].rawDateAdded === undefined) {
        return '-'
      } else {
        return Moment(this.group.photos[0].rawDateAdded).fromNow(true)
      }
    }
  },
  methods: {
    share() {
      this.dialog = true
    },
    closePopUp() {
      this.dialog = false
    }
  }
}
</script>
<style>
.break {
  word-break: break-all;
}
</style>
