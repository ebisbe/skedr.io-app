<template>
  <v-content>
    <ApolloQuery
      :query="require('@/graphql/photostream.gql')"
      :variables="{
        page: 1,
        perPage
      }"
      tag=""
    >
      <template slot-scope="{ result: { error, data, loading }, query}">
        <!-- Loading -->
        <q-empty
          v-if="loading && data === undefined"
          :loading="true"/>

        <!-- Error -->
        <q-empty
          v-else-if="error"
          :error="true"
          icon="photo"/>

        <!-- Result -->
        <v-container
          v-else-if="data"
          fluid
          grid-list-md >
          <v-layout
            row
            wrap >
            <v-flex
              v-for="photo in data.userPhotos.photos"
              :key="photo.id"
              md4
              sm6
              xs12>
              <photo :photo="photo"/>
            </v-flex>
            <v-flex xs12>
              <app-observer @intersect="showMore(query)"/>
              <v-btn
                :disabled="!showMoreEnabled || loading"
                block
                color="accent"
                @click="showMore(query)">
                <v-progress-circular
                  v-if="loading"
                  indeterminate
                  color="grey"/>
                <span v-else>
                  &nbsp;Load more photos
                </span>
              </v-btn>
            </v-flex>
          </v-layout>
        </v-container>

        <!-- No result -->
        <q-empty
          v-else
          description="Your Photostream is empty. Upload some photos in Flickr"
          icon="photo"/>
      </template>
    </ApolloQuery>
  </v-content>
</template>
<script>
import Photo from '@/components/photo/Photo'
import QEmpty from '@/components/ui/QEmpty'
import AppObserver from '@/components/common/AppObserver'
import { mapState } from 'vuex'

export default {
  name: 'Photos',
  components: { Photo, QEmpty, AppObserver },
  data() {
    return {
      page: 1,
      showMoreEnabled: true
    }
  },
  computed: {
    perPage() {
      switch (true) {
        case this.$vuetify.breakpoint.xs:
          return 3
        case this.$vuetify.breakpoint.sm:
          return 8
        case this.$vuetify.breakpoint.md:
          return 15
        case this.$vuetify.breakpoint.lgAndUp:
          return 15
      }
    },
    ...mapState({ search: ({ search }) => search })
  },
  methods: {
    showMore(query) {
      //Fetch more data and transform the original result
      query.fetchMore({
        variables: {
          page: ++this.page,
          perPage: this.perPage
        },
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
