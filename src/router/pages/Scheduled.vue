<template>
    <v-content>
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
  import gql from 'graphql-tag'
  import PhotoList from '../../components/PhotoList.vue'
  import { mapGetters } from 'vuex'
  import * as _ from 'lodash'
  import * as moment from 'moment'

  export default {
    name: 'Scheduled',
    components: {PhotoList},
    data () {
      return {
        scheduledPhotos: []
      }
    },
    methods: {
      scheduled (data) {
        const mappedData = data.map((photo) => {
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
        return _.groupBy(mappedData, 'headerDate')
      },
      groups (data) {
        return _.groupBy(data, 'group.title')
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
        query: gql `query scheduled($userId: ID!){
    scheduledPhotos (userId: $userId){
      userId
      groupId
      photoId
      secret
      scheduledAt
      message
      group {
        title
      }
    }
    }`,
        variables () {
          return {
            userId: this.userId
          }
        },
        update: data => data.scheduledPhotos.map(photo => Object.assign({headerDate: ''}, photo)),
        fetchPolicy: 'cache-and-network',
        loadingKey: 'loading'
      }
    }
  }
</script>