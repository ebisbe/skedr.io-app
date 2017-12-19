<template>
    <v-content>
        <v-container fluid grid-list-xl>
            <v-layout row wrap>
                <v-flex xs12>
                    <my-fetch url="scheduled">
                        <div slot-scope="data">
                            <template v-for="(item, index) in scheduled(data)">
                                <h4 class="text-xs-center mt-3" v-text="index"></h4>
                                <v-list two-line>
                                    <template v-for="(group, groupId) in groups(item)">
                                        <v-subheader v-text="groupId"></v-subheader>
                                        <template v-for="(photo, iteration) in group">
                                            <v-divider v-show="iteration !== 0" inset></v-divider>
                                            <photo-list :photo="photo"></photo-list>
                                        </template>
                                    </template>
                                </v-list>
                            </template>
                        </div>
                    </my-fetch>
                </v-flex>
            </v-layout>
        </v-container>
    </v-content>
</template>
<script>
  import PhotoList from '../../components/PhotoList.vue'
  import * as _ from 'lodash'
  import * as moment from 'moment'

  export default {
    name: 'Scheduled',
    components: {PhotoList},
    methods: {
      scheduled (data) {
        const mappedData = _.map(data, function (photo) {
          photo.headerDate = moment(parseInt(photo.scheduledAt)).calendar(null, {
            nextDay: '[Tomorrow]',
            nextWeek: 'dddd, Do',
            sameElse: 'DD-MM-YYYY',
            lastDay: '[Yesterday]',
            lastWeek: '[Last] dddd',
            sameDay: '[Today]'
          })
          return photo
        })
        return _.groupBy(mappedData, 'headerDate')
      },
      groups (data) {
        return _.groupBy(data, 'groupId')
      }
    }
  }
</script>