<template>
  <v-content>
    <!-- Loading -->
    <q-empty
      v-if="$apollo.queries.scheduledPhotos.loading"
      :loading="true"/>

    <!-- Error -->
    <q-empty
      v-else-if="$apollo.error"
      :error="true"
      icon="access_time"/>

    <v-container
      v-else-if="scheduledPhotos.length"
      fluid
      class="pt-0 q-schedule"
      grid-list-md>
      <v-layout
        v-for="(item, index) in scheduled"
        :key="index+item"
        class="pb-3">
        <v-flex
          xs2
          sm1
          class="headline">
          <span class="date" v-html="index" />
        </v-flex>
        <v-flex
          xs10
          sm11
          class="pt-0">
          <template v-for="(group, title) in groups(item)">
            <h2
              :key="title+index"
              class="title"
              v-html="group[0].group.title"/>
            <v-layout
              :key="title+index+'layout'"
              row
              wrap>
              <v-flex
                v-for="(photo, iteration) in group"
                :key="title+iteration+photo.photoId"
                :xs6="group.length !== 1"
                :xs12="group.length === 1"
                sm4>
                <photo-scheduled :photo="photo" :height="150" />
              </v-flex>
            </v-layout>
          </template>
        </v-flex>
      </v-layout>
    </v-container>
    <q-empty
      v-else
      icon="access_time"
      description="You don't have any photos scheduled"/>
  </v-content>
</template>
<script>
import PhotoScheduled from '@/components/photo/PhotoScheduled'
import QEmpty from '@/components/ui/QEmpty'
import _groupBy from 'lodash/groupBy'
import Moment from 'moment'

export default {
  name: 'Scheduled',
  components: { PhotoScheduled, QEmpty },
  data() {
    return {
      scheduledPhotos: [],
      error: false
    }
  },
  computed: {
    scheduled() {
      const format = 'D <br> ddd'
      const mappedData = this.scheduledPhotos.map(photo => {
        photo.headerDate = Moment.unix(photo.scheduledAt)
          .utc()
          .calendar(null, {
            nextDay: format,
            nextWeek: format,
            sameElse: format,
            sameDay: format
          })
        return photo
      })
      return _groupBy(mappedData, 'headerDate')
    }
  },
  methods: {
    groups(data) {
      return _groupBy(data, 'group.title')
    }
  },
  apollo: {
    scheduledPhotos: {
      query: require('@/graphql/scheduled.gql'),
      fetchPolicy: 'cache-and-network',
      variables() {
        return {
          scheduledAt: new Moment()
            .utc()
            .startOf(`day`)
            .unix()
        }
      }
    }
  }
}
</script>
<style lang="css">
.q-schedule .date {
  position: sticky;
  top: 60px;
}
.q-schedule .title {
  padding-top: 10px;
  padding-bottom: 4px;
  position: sticky;
  top: 56px;
  z-index: 2;
  background: #fafafa;
}
</style>
