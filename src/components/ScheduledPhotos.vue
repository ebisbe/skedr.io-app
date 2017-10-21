<template>
    <my-fetch url="/scheduled">
        <v-list two-line slot-scope="data">
            <template v-for="(item, index) in scheduled(data)">
                <v-subheader v-text="headerDate(index)"></v-subheader>
                <template v-for="(photo, iteration) in item">
                    <v-divider v-show="iteration !== 0" inset></v-divider>
                    <photo-list :photo="photo"></photo-list>
                </template>
            </template>
        </v-list>
    </my-fetch>
</template>
<script>
  import PhotoList from '../components/PhotoList.vue'
  import * as _ from 'lodash'
  import * as moment from 'moment'

  export default {
    name: 'ScheduledPhotos',
    components: {PhotoList},
    methods: {
      scheduled (data) {
        return _.groupBy(data, 'scheduledAt')
      },
      headerDate (index) {
        return moment(parseInt(index)).calendar(null, {
          nextDay: '[Tomorrow]',
          nextWeek: 'dddd, Do',
          sameElse: 'DD-MM-YYYY'
        })
      }
    }
  }
</script>