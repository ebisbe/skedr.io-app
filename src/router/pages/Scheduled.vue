<template>
    <v-content>
        <v-progress-linear height="3" class="my-0" v-bind:indeterminate="true" v-if="loading"></v-progress-linear>
        <v-container fluid grid-list-xl>
            <v-layout row wrap>
                <v-flex xs12>
                    <template v-for="(item, index) in scheduled(scheduledPhotos)">
                        <h4 class="text-xs-center mt-3" v-text="index"></h4>
                        <v-list two-line>
                            <template v-for="(group, title) in groups(item)">
                                <v-subheader v-html="subheader(group[0].group)"></v-subheader>
                                <template v-for="(photo, iteration) in group">
                                    <v-divider v-show="iteration !== 0" inset></v-divider>
                                    <photo-list :photo="photo"></photo-list>
                                </template>
                            </template>
                        </v-list>
                    </template>
                </v-flex>
            </v-layout>
        </v-container>
    </v-content>
</template>
<script>
  import PhotoList from '../../components/PhotoList.vue'
  import { mapGetters } from 'vuex'
  import groupBy from 'lodash/groupby'
  import * as moment from 'moment'
  import SCHEDULED_QUERY from '../../graphql/scheduled.gql'

  export default {
    name: 'Scheduled',
    components: {PhotoList},
    data () {
      return {
        scheduledPhotos: [],
        loading: 0
      }
    },
    methods: {
      scheduled (data) {
        const mappedData = data.map(photo => {
          photo.headerDate = moment(photo.scheduledAt).calendar(null, {
            nextDay: '[Tomorrow]',
            nextWeek: 'dddd, Do',
            sameElse: 'DD-MM-YYYY',
            lastDay: '[Yesterday]',
            lastWeek: '[Last] dddd',
            sameDay: '[Today]'
          })
          return photo
        })
        return groupBy(mappedData, 'headerDate')
      },
      groups (data) {
        return groupBy(data, 'group.title')
      },
      subheader (group) {
        return `${group.title}`
      }
    },
    computed: {
      ...mapGetters(['userId'])
    },
    apollo: {
      scheduledPhotos: {
        query: SCHEDULED_QUERY,
        variables () {
          return {
            userId: this.userId
          }
        },
        update: data =>
          data.scheduledPhotos.map(photo =>
            Object.assign({headerDate: ''}, photo)
          ),
        fetchPolicy: 'cache-and-network',
        loadingKey: 'loading'
      }
    }
  }
</script>