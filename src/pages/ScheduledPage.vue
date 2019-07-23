<template>
  <v-content>
    <ApolloQuery
      :query="require('@/graphql/scheduled.gql')"
      :variables="{
        count,
        scheduledAt
      }"
      tag="">
      <template slot-scope="{ result: { data, loading, error }, query }" >
        <!-- Loading -->
        <q-empty
          v-if="loading && data === undefined"
          :loading="true"/>

        <!-- Error -->
        <q-empty
          v-else-if="error"
          :error="true"
          :description="error"
          icon="access_time"/>

        <v-container
          v-else-if="data && data.scheduledPhotos.scheduledPhotos.length"
          fluid
          class="pt-0 q-schedule"
          grid-list-md>
          <v-layout
            v-for="(item, index) in scheduled(data.scheduledPhotos.scheduledPhotos)"
            :key="index+item"
            class="pb-3">
            <v-flex
              xs2
              sm1
              class="headline">
              <span class="date" v-html="item[0].headerDate" />
            </v-flex>
            <v-flex
              xs10
              sm11
              class="pt-0">
              <template v-for="(group, title) in groups(item)">
                <h2
                  v-if="group"
                  :key="title+index"
                  class="title"
                  v-html="`${group[0].group.title} (${group.length})`"/>
                <v-layout
                  :key="title+index+'layout'"
                  row
                  wrap>
                  <v-flex
                    v-for="(photo, iteration) in group"
                    :key="title+iteration+photo.photoId"
                    :xs6="group.length !== 1"
                    :xs12="group.length === 1"
                    sm3>
                    <photo-scheduled :photo="photo" />
                  </v-flex>
                </v-layout>
              </template>
            </v-flex>
          </v-layout>
          <v-flex v-if="showMoreEnabled" xs12>
            <app-observer @intersect="showMore(query, data.scheduledPhotos.nextToken)"/>
            <v-btn
              :disabled="!showMoreEnabled || loading"
              block
              color="accent"
              @click="showMore(query, data.scheduledPhotos.nextToken)">
              <v-progress-circular
                v-if="loading"
                indeterminate
                color="grey"/>
              <span v-else>
                &nbsp;{{ $t('btn.load_future_dates') }}
              </span>
            </v-btn>
          </v-flex>
        </v-container>
        <q-empty
          v-else
          :description="$t('Layout.no_photos_scheduled')"
          icon="access_time"/>
      </template>
    </ApolloQuery>
  </v-content>
</template>
<script>
import PhotoScheduled from '@/components/photo/PhotoScheduled'
import QEmpty from '@/components/ui/QEmpty'
import AppObserver from '@/components/common/AppObserver'
import _groupBy from 'lodash/groupBy'
import { scheduledAt } from '@/mixins'
import Moment from 'moment'
import * as Sentry from '@sentry/browser'
import { mapMutations } from 'vuex'

export default {
  name: 'Scheduled',
  components: { PhotoScheduled, QEmpty, AppObserver },
  mixins: [scheduledAt],
  data() {
    return {
      count: 15,
      showMoreEnabled: true
    }
  },
  beforeDestroy() {
    this.clearPool()
    return true
  },
  methods: {
    ...mapMutations({
      clearPool: 'pool/clear'
    }),
    scheduled(data) {
      const format = 'D <br> ddd'
      const mappedData = data.map(photo => {
        photo.dayOfYear = Moment.unix(photo.scheduledAt)
          .utc()
          .dayOfYear()
        photo.headerDate = Moment.unix(photo.scheduledAt)
          .utc()
          .calendar(null, {
            sameDay: format,
            nextDay: format,
            nextWeek: format,
            lastDay: format,
            lastWeek: format,
            sameElse: format
          })
        return photo
      })
      return _groupBy(mappedData, 'dayOfYear')
    },
    groups(data) {
      return _groupBy(data, 'group.title')
    },
    showMore(query, nextToken) {
      if (nextToken === null) {
        this.showMoreEnabled = false
        return
      }
      //Fetch more data and transform the original result
      query.fetchMore({
        variables: {
          count: this.count,
          scheduledAt: this.scheduledAt,
          nextToken
        },
        updateQuery: (
          { scheduledPhotos: { scheduledPhotos: prevPhotos } },
          { fetchMoreResult: { scheduledPhotos } }
        ) => {
          this.showMoreEnabled = scheduledPhotos.nextToken !== null
          scheduledPhotos.scheduledPhotos = [...prevPhotos, ...scheduledPhotos.scheduledPhotos]
          return {
            __typename: scheduledPhotos.__typename,
            scheduledPhotos
          }
        }
      })
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
