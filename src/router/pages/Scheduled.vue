<template>
  <v-content>
    <v-container
      v-if="scheduledPhotos.length"
      fluid
      class="pt-0 sked-schedule"
      grid-list-md>
      <v-layout
        v-for="(item, index) in scheduled(scheduledPhotos)"
        :key="index+item"
        class="pb-3">
        <v-flex
          xs1
          class="display-1">
          <span class="date" v-html="index" />
        </v-flex>
        <v-flex xs11 class="pt-0">
          <template v-for="(group, title) in groups(item)">
            <h2
              :key="title+index"
              class="title"
              v-html="subheader(group[0].group)"/>
            <v-layout
              :key="title+index+'layout'"
              row
              wrap>
              <v-flex
                v-for="(photo, iteration) in group"
                :key="title+iteration+photo.photoId"
                md4
                sm6
                xs12>
                <photo-scheduled :photo="photo" />
              </v-flex>
            </v-layout>
          </template>
        </v-flex>
      </v-layout>
    </v-container>
    <empty
      v-else
      :loading="loading === 1"
      icon="access_time"
      description="You don't have any photos scheduled"/>
  </v-content>
</template>
<script>
import PhotoScheduled from '../../components/QPhotoScheduled'
import Empty from './Empty'
import { mapGetters } from 'vuex'
import _groupBy from 'lodash/groupby'
import * as moment from 'moment'
import SCHEDULED_QUERY from '../../graphql/scheduled.gql'

export default {
  name: 'Scheduled',
  components: { PhotoScheduled, Empty },
  data() {
    return {
      scheduledPhotos: [],
      loading: 0
    }
  },
  computed: {
    ...mapGetters(['userId'])
  },
  methods: {
    scheduled(data) {
      const format = 'D <br> ddd'
      const mappedData = data.map(photo => {
        photo.headerDate = moment.utc(photo.scheduledAt).calendar(null, {
          nextDay: format,
          nextWeek: format,
          sameElse: format,
          sameDay: format
        })
        return photo
      })
      return _groupBy(mappedData, 'headerDate')
    },
    groups(data) {
      return _groupBy(data, 'group.title')
    },
    subheader(group) {
      return `${group.title}`
    }
  },
  apollo: {
    scheduledPhotos: {
      query: SCHEDULED_QUERY,
      variables() {
        return {
          userId: this.userId
        }
      },
      update: data => data.scheduledPhotos.map(photo => Object.assign({ headerDate: '' }, photo)),
      fetchPolicy: 'cache-and-network',
      loadingKey: 'loading'
    }
  }
}
</script>
<style>
.sked-schedule .date {
  position: sticky;
  top: 60px;
}
.sked-schedule .title {
  padding-top: 10px;
  padding-bottom: 4px;
  position: sticky;
  top: 56px;
  z-index: 2;
  background: #fafafa;
}
</style>
