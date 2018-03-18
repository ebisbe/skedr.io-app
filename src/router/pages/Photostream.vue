<template>
  <v-content>
    <v-container
      fluid
      grid-list-md
      v-if="userPhotos.length">
      <v-layout
        row
        wrap
        v-if="searchImages === ''">
        <v-flex
          lg3
          md4
          sm6
          xs12
          v-for="photo in userPhotos"
          :key="photo.id">
          <photo :photo="photo"/>
        </v-flex>
        <v-flex>
          <v-btn
            block
            color="info"
            @click="showMore"
            :disabled="loading === 1"
            dark>
            <v-progress-circular
              indeterminate
              v-if="loading"
              color="info"/>
            <span v-else>
              &nbsp;Load more photos...
            </span>
          </v-btn>
        </v-flex>
      </v-layout>
      <v-layout v-else>
        <my-fetch
          :url="searchImages"
          method="post"
          :data="{text: search}">
          <transition-group
            name="list"
            tag="div"
            class="layout wrap"
            slot-scope="data">
            <v-flex
              md3
              sm6
              xs12
              v-for="photo in data.photo"
              :key="photo.id">
              <photo :photo="photo"/>
            </v-flex>
          </transition-group>
        </my-fetch>
      </v-layout>
    </v-container>
    <empty
      v-else
      icon="photo"
      :loading="loading === 1"
      description="You don't have any photo yet"/>
  </v-content>
</template>
<script>
import Photo from '../../components/Photo'
import Empty from './Empty'
import { mapState, mapGetters } from 'vuex'
import STREAM_QUERY from '../../graphql/photostream.gql'

const itemsPerPage = 9
export default {
  name: 'Photos',
  components: { Photo, Empty },
  data() {
    return {
      loading: 0,
      offset: itemsPerPage,
      userPhotos: []
    }
  },
  computed: {
    searchImages() {
      if (this.search === '') {
        return ''
      }
      return 'search'
    },
    ...mapGetters(['userId']),
    ...mapState(['search'])
  },
  apollo: {
    userPhotos: {
      query: STREAM_QUERY,
      variables() {
        return {
          userId: this.userId,
          offset: itemsPerPage
        }
      },
      update: data => data.userPhotos,
      fetchPolicy: 'cache-and-network',
      loadingKey: 'loading'
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
          // this.showMoreEnabled = hasMore

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
