<template>
  <v-content>
    <v-container
      v-if="scheduledPhotos.length"
      fluid
      grid-list-md>
      <v-layout
        class="pb-3"
        v-for="(item, index) in scheduled(scheduledPhotos)"
        :key="index+item">
        <v-flex
          xs1
          class="display-1"
          v-html="index" />
        <v-flex xs11>
          <template v-for="(group, title) in groups(item)">
            <h2 v-html="subheader(group[0].group)" :key="title+index"/>
            <v-layout
              :key="title+index+'layout'"
              row
              wrap>
              <v-flex
                md4
                sm6
                xs12
                v-for="(photo, iteration) in group"
                :key="title+iteration+photo.photoId">
                <photo-scheduled :photo="photo" />
              </v-flex>
            </v-layout>
          </template>
        </v-flex>
      </v-layout>
    </v-container>
    <empty
      v-else
      icon="access_time"
      :loading="loading === 1"
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
