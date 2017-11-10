<template>
    <tr :active="isSelected" @click="data.expanded = !data.expanded">
        <td class="px-1">
            <v-checkbox v-model="isSelected" hide-details @click.stop="checkBoxClick()"
                        class="pa-1"></v-checkbox>
        </td>
        <td class="px-1">
            <v-avatar size="40px" slot="activator">
                <img :src="group.icon" :alt="group.title">
            </v-avatar>
        </td>
        <td>{{ group.title }}</td>
        <td class="text-xs-right">{{ dateAddedFormated }}</td>
        <td class="text-xs-right">{{ group.poolCount }}
            <v-icon>photo</v-icon>
        </td>
        <td class="text-xs-right">{{ group.members }}
            <v-icon>face</v-icon>
        </td>
        <td class="text-xs-right gray--text">
            <span v-html="throttleText"></span>
            <strong>{{ group.throttleMode }}</strong>
        </td>
    </tr>
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
    name: 'Row',
    props: {
      data: {required: true}
    },
    data () {
      return {
        isSelected: false
      }
    },
    computed: {
      ...mapState([
        'selectedGroups'
      ]),
      group () {
        return this.data.item
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
    },
    methods: {
      checkBoxClick () {
        this.isSelected = !this.isSelected
        this.data.selected = this.isSelected
      }
    },
    watch: {
      'data.selected' (value) {
        this.isSelected = value
      }
    }
  }
</script>