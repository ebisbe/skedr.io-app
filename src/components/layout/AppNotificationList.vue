<template>
  <ApolloQuery
    :query="require('@/graphql/notifications.gql')"
    :variables="{ count }"
    :poll-interval="poll"
    tag=""
  >
    <template slot-scope="{ result: { error, data }, isLoading, query }">
      <v-navigation-drawer
        v-model="rightDrawer"
        fixed
        app
        temporary
        right
      >
        <v-container fluid pa-0>
          <!-- Loading -->
          <div v-if="isLoading && data === null" class="loading apollo">Loading...</div>

          <!-- Error -->
          <div v-else-if="error" class="error apollo">An error occured</div>

          <!-- Result -->
          <template v-else-if="data && data.notifications.notifications.length">
            <v-list three-line >

              <template
                v-for="(item, index) in data.notifications.notifications"
              >
                <v-divider
                  v-if="index !== 0"
                  :key="`${index}-divider`"
                />
                <v-list-tile
                  :key="index"
                  @click.stop
                >
                  <v-list-tile-avatar>
                    <img :src="composeUrl(item.photo)" :alt="item.photo.title">
                  </v-list-tile-avatar>

                  <v-list-tile-content>
                    <v-list-tile-title v-html="item.message"/>
                    <v-list-tile-sub-title>{{ item.group.title }} <br> {{ createdAt(item.createdAt) }}</v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
              </template>
              <v-list-tile v-if="isLoading">
                <v-btn
                  :loading="isLoading === 1"
                  block
                  disabled>Loading</v-btn>
              </v-list-tile>
            </v-list>
            <app-observer v-if="showMoreEnabled" @intersect="showMore(query, data.notifications.nextToken)"/>
          </template>

          <!-- No result -->
          <v-list v-else class="no-result apollo"><v-list-tile>You don't have new notifications.</v-list-tile></v-list>
        </v-container>
      </v-navigation-drawer>
    </template>
  </ApolloQuery>
</template>

<script>
import Moment from 'moment'
import AppObserver from '@/components/common/AppObserver'

export default {
  components: { AppObserver },
  props: {
    drawer: {
      type: Boolean,
      required: true
    }
  },
  data: () => ({ poll: 0, count: 10, showMoreEnabled: true }),
  computed: {
    rightDrawer: {
      get() {
        return this.drawer
      },
      set(value) {
        if (value) this.poll = 0
        else this.poll = 0
        this.$emit('updated', value)
      }
    }
  },
  methods: {
    createdAt(createdAt) {
      return new Moment(createdAt).add(1, 'h').fromNow()
    },
    composeUrl({ photoId, secret, farm, server }) {
      return `https://farm${farm}.staticflickr.com/${server}/${photoId}_${secret}_s.jpg`
    },
    showMore(query, nextToken) {
      //Fetch more data and transform the original result
      query.fetchMore({
        variables: {
          count: this.count,
          nextToken
        },
        updateQuery: ({ notifications: { notifications: prevPhotos } }, { fetchMoreResult: { notifications } }) => {
          this.showMoreEnabled = notifications.nextToken !== null
          notifications.notifications = [...prevPhotos, ...notifications.notifications]
          return {
            __typename: notifications.__typename,
            notifications
          }
        }
      })
    }
  }
}
</script>
