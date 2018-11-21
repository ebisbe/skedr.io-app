<template>
  <v-content>
    <v-container
      v-if="userPhotos.photos.length"
      fluid
      grid-list-md >
      <v-layout
        v-if="searchImages === ''"
        row
        wrap >
        <v-flex
          v-for="photo in userPhotos.photos"
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
import { mapState } from 'vuex'
import STREAM_QUERY from '@/graphql/photostream.gql'

export default {
  name: 'Photos',
  components: { QPhoto, QEmpty, MyFetch, AppObserver },
  data() {
    return {
      userPhotos: { photos: [] },
      error: false,
      page: 1,
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
    perPage() {
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
    ...mapState({ search: ({ search }) => search })
  },
  apollo: {
    userPhotos: {
      query: STREAM_QUERY,
      variables() {
        return {
          page: 1,
          perPage: this.perPage
        }
      },
      update: ({ userPhotos }) => userPhotos,
      error() {
        this.error = true
      }
    }
  },
  methods: {
    showMore() {
      //Fetch more data and transform the original result
      this.$apollo.queries.userPhotos.fetchMore({
        variables: {
          page: ++this.page,
          perPage: this.perPage
        },
        // Transform the previous result with new data
        updateQuery: ({ userPhotos: { photos: prevPhotos } }, { fetchMoreResult: { userPhotos } }) => {
          this.showMoreEnabled = userPhotos.page !== userPhotos.pages

          userPhotos.photos = [...prevPhotos, ...userPhotos.photos]
          return {
            __typename: userPhotos.__typename,
            userPhotos
          }
        }
      })
    }
  }
}
</script>
