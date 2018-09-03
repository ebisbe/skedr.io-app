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
          <photo :photo="photo"/>
        </v-flex>
        <v-flex>
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
              <photo :photo="photo"/>
            </v-flex>
          </transition-group>
        </my-fetch>
      </v-layout>
    </v-container>
    <empty
      v-else
      :loading="$apolloData.loading === 1"
      :error="error"
      description="You don't have any photo yet"
      icon="photo"/>
  </v-content>
</template>
<script>
import Photo from '../components/Photo'
import Empty from '../components/Empty'
import MyFetch from '../components/MyFetch'
import { mapState, mapGetters } from 'vuex'
import STREAM_QUERY from '../graphql/photostream.gql'

const itemsPerPage = 6
export default {
  name: 'Photos',
  components: { Photo, Empty, MyFetch },
  data() {
    return {
      offset: itemsPerPage,
      userPhotos: [],
      error: false,
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
    ...mapGetters({ userId: 'user/userId' }),
    ...mapState(['search'])
  },
  apollo: {
    userPhotos: {
      query: STREAM_QUERY,
      fetchPolicy: 'cache-and-network',
      variables() {
        return {
          userId: this.userId,
          offset: itemsPerPage,
          count: 6
        }
      },
      update: data => (data.hasOwnProperty('userPhotos') ? data.userPhotos : []),
      error() {
        this.error = true
      }
    }
  },
  methods: {
    showMore() {
      this.offset += itemsPerPage
      // Fetch more data and transform the original result
      this.$apollo.queries.userPhotos.fetchMore({
        // New variables
        variables: {
          userId: this.userId,
          offset: this.offset
        },
        // Transform the previous result with new data
        updateQuery: (previousResult, data) => {
          // const hasMore = fetchMoreResult.tagsPage.hasMore
          this.showMoreEnabled = data.fetchMoreResult.userPhotos.length > 0

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
