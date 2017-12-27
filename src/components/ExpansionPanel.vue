<template>
    <div>
        <v-layout align-center row wrap spacer>
            <v-flex xs2 sm1 md1>
                <v-avatar size="40px">
                    <a :href="link"
                       target="_blank"
                       @click.stop="a"
                       class="text--secondary">
                        <img :src="group.icon" :alt="group.title">
                    </a>
                </v-avatar>
            </v-flex>
            <v-flex d-flex xs10 sm11>
                <v-layout row wrap>
                    <v-flex d-flex xs12 sm6 lg6>
                        <strong v-html="group.title" class="break"></strong>
                        <!--<a :href="link"-->
                           <!--target="_blank"-->
                           <!--class="text&#45;&#45;secondary">-->
                            <!--<v-icon>open_in_browser</v-icon>-->
                        <!--</a>-->
                    </v-flex>
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
      group: {
        type: Object,
        required: true
      }
    },
    computed: {
      link () {
        return 'https://www.flickr.com/groups/' + this.group.groupId
      },
      throttleText () {
        if (this.group.throttleRemaining === undefined) {
          return '∞'
        }
        if (this.group.throttleCount === 0) {
          return '&mdash;'
        }
        return this.group.throttleRemaining + '/' + this.group.throttleCount
      },
      dateAddedFormated () {
        if (this.group.photos[0].rawDateAdded === undefined) {
          return '-'
        } else {
          return Moment(this.group.photos[0].rawDateAdded).fromNow(true)
        }
      }
    }
  }
</script>
<style>
    .break {
        word-break: break-all;
    }
</style>
