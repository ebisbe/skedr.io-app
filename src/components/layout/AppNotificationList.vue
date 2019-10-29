<template>
  <v-navigation-drawer
    v-model="rightDrawer"
    fixed
    temporary
    right
  >
    <ApolloQuery
      :query="require('@/graphql/notifications.gql')"
      :variables="{ count }"
      tag=""
    >
      <template slot-scope="{ result: { error, data }, isLoading, query, gqlError }">
        <v-container fluid pa-0>
          <!-- Loading -->
          <v-btn
            v-t="'loading'"
            v-if="isLoading && data === null"
            :loading="isLoading === 1"
            block
            small
            class="ma-0"
            outlined/>

          <!-- Error -->
          <div v-else-if="error" class="error apollo">An error occured: [{{ gqlError }}]</div>

          <!-- Result -->
          <template v-else-if="data && data.notifications.notifications.length">
            <v-layout
              v-if="refetchData"
              py-2
              px-4>
              <v-flex>
                <v-btn
                  v-t="'btn.update'"
                  :loading="isLoading === 1"
                  block
                  small
                  class="ma-0"
                  outlined
                  @click="query.refetch()"/>
                <app-observer
                  @intersect="() => {
                    query.refetch()
                    refetchData = false
                }"/>
              </v-flex>
            </v-layout>
            <v-list three-line >
              <template
                v-for="(item, index) in data.notifications.notifications"
              >
                <v-divider
                  v-if="index !== 0"
                  :key="`${index}-divider`"
                />
                <v-list-item
                  :key="index"
                  @click.stop
                >
                  <v-list-item-avatar>
                    <img :src="composeUrl(item.photo)" :alt="item.photo.title">
                  </v-list-item-avatar>

                  <v-list-item-content>
                    <v-list-item-title v-html="item.message"/>
                    <v-list-item-subtitle>{{ item.group.title }} <br> {{ createdAt(item.createdAt) }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </v-list>
            <v-layout
              v-if="showMoreEnabled"
              py-2
              px-4>
              <v-flex>
                <v-btn
                  v-t="'btn.load_more'"
                  :loading="isLoading === 1"
                  :disabled="data.notifications.nextToken === null"
                  block
                  small
                  outlined
                  class="px-0 ma-0"
                  @click="showMore(query, data.notifications.nextToken)"/>
                  <!-- <app-observer v-if="showMoreEnabled" @intersect="showMore(query, data.notifications.nextToken)"/> -->
              </v-flex>
            </v-layout>
          </template>

          <!-- No result -->
          <v-list v-else class="no-result apollo">
            <v-list-item v-t="'Layout.no_notifications'"/>
          </v-list>
        </v-container>
      </template>
    </ApolloQuery>
  </v-navigation-drawer>
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
  data: () => ({ count: 15, showMoreEnabled: true, refetchData: false }),
  computed: {
    rightDrawer: {
      get() {
        return this.drawer
      },
      set(value) {
        if (value) {
          this.showMoreEnabled = true
          this.refetchData = true
        }
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
      if (nextToken === null) return
      //Fetch more data and transform the original result
      query.fetchMore({
        variables: {
          count: this.count,
          nextToken
        },
        updateQuery: ({ notifications: { notifications: prevNot } }, { fetchMoreResult: { notifications } }) => {
          this.showMoreEnabled = notifications.nextToken !== null
          notifications.notifications = [...prevNot, ...notifications.notifications]
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
