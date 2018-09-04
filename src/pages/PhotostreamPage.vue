<template>
  <v-content>
    <v-container
      v-if="userPhotos.length"
      fluid
      grid-list-md >
      <v-layout
        v-if="searchImages === ''"
        row
        wrap >
        <v-flex
          v-for="photo in userPhotos"
          :key="photo.id"
          md4
          sm6
          xs12>
          <q-photo :photo="photo"/>
        </v-flex>
        <v-flex xs12>
          <app-observer @intersect="showMore"/>
          <v-btn
            :disabled="!showMoreEnabled || $apolloData.loading === 1"
            block
            color="accent"
            @click="showMore">
            <v-progress-circular
              v-if="$apolloData.loading"
              indeterminate
              color="grey"/>
            <span v-else>
              &nbsp;Load more photos...
            </span>
          </v-btn>
        </v-flex>
      </v-layout>
      <v-layout v-else>
        <my-fetch
          :url="searchImages"
          :data="{text: search}"
          method="post">
          <transition-group
            slot-scope="data"
            name="list"
            tag="div"
            class="layout wrap">
            <v-flex
              v-for="photo in data.photo"
              :key="photo.id"
              md3
              sm6
              xs12>
              <q-photo :photo="photo"/>
            </v-flex>
          </transition-group>
        </my-fetch>
      </v-layout>
    </v-container>
    <q-empty
      v-else
      :loading="$apolloData.loading === 1"
      :error="error"
      description="You don't have any photo yet"
      icon="photo"/>
  </v-content>
</template>
<script>
import QPhoto from '@/components/ui/QPhoto'
import QEmpty from '@/components/ui/QEmpty'
import AppObserver from '@/components/common/AppObserver'
import MyFetch from '@/components/common/MyFetch'
import { mapState, mapGetters } from 'vuex'
import STREAM_QUERY from '@/graphql/photostream.gql'

export default {
  name: 'Photos',
  components: { QPhoto, QEmpty, MyFetch, AppObserver },
  data() {
    return {
      userPhotos: [],
      error: false,
      offset: null,
      showMoreEnabled: true
    }
  },
  computed: {
    searchImages() {
      if (this.search === '') {
        return ''
      }
      return '/search'
    },
    itemsPerPage() {
      switch (true) {
        case this.$vuetify.breakpoint.xs:
          return 3
        case this.$vuetify.breakpoint.sm:
          return 8
        case this.$vuetify.breakpoint.md:
          return 12
        case this.$vuetify.breakpoint.lgAndUp:
          return 15
      }
    },
    ...mapGetters({ userId: 'user/userId' }),
    ...mapState({ search: ({ search }) => search })
  },
  mounted() {
    this.offset = this.itemsPerPage
  },
  apollo: {
    userPhotos: {
      query: STREAM_QUERY,
      fetchPolicy: 'cache-and-network',
      variables() {
        return {
          userId: this.userId,
          offset: this.itemsPerPage,
          count: this.itemsPerPage
        }
      },
      update: ({ userPhotos = [] }) => userPhotos,
      error() {
        this.error = true
      }
    }
  },
  methods: {
    showMore() {
      // Fetch more data and transform the original result
      this.offset += this.itemsPerPage
      this.$apollo.queries.userPhotos.fetchMore({
        variables: {
          offset: this.offset,
          count: this.itemsPerPage
        },
        // Transform the previous result with new data
        updateQuery: (previousResult, data) => {
          // const hasMore = fetchMoreResult.tagsPage.hasMore
          this.showMoreEnabled = data.fetchMoreResult.userPhotos.length !== 0

          return {
            __typename: previousResult.userPhotos.__typename,
            userPhotos: [...previousResult.userPhotos, ...data.fetchMoreResult.userPhotos]
          }
        }
      })
    }
  }
}
</script>
