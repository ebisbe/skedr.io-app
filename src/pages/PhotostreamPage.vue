<template>
  <v-content>
    <ApolloQuery
      v-slot="{ result: { error, data, loading } }"
      :query="require('@/graphql/photostream.gql')"
      :variables="{
        page,
        perPage
      }"
      tag=""
    >
      <template>
        <q-empty v-if="loading" :loading="true" />
        <q-empty v-else-if="error" :description="error" :error="true" icon="photo" />

        <v-container v-else-if="data" fluid grid-list-md>
          <v-layout row wrap>
            <v-flex v-for="photo in data.userPhotos.photos" :key="photo.id" md3 sm4 xs12>
              <photo :photo="photo" />
            </v-flex>

            <v-pagination
              v-model="page"
              class="mx-auto"
              :length="data.userPhotos.pages"
              total-visible="11"
            ></v-pagination>
          </v-layout>
        </v-container>

        <q-empty v-else :description="$t('Layout.photostream_empty')" icon="photo" />
      </template>
    </ApolloQuery>
  </v-content>
</template>
<script>
  import Photo from '@/components/photo/Photo'
  import QEmpty from '@/components/ui/QEmpty'
  import { mapState, mapMutations } from 'vuex'

  export default {
    name: 'Photos',
    components: { Photo, QEmpty },
    data() {
      return {
        page: 1,
        showMoreEnabled: true
      }
    },
    computed: {
      perPage() {
        let value = 3
        switch (true) {
          case this.$vuetify.breakpoint.xs:
            value = 3
          case this.$vuetify.breakpoint.sm:
            value = 9
          case this.$vuetify.breakpoint.mdAndUp:
            value = 12
        }
        return value
      },
      ...mapState({ search: ({ search }) => search })
    },
    beforeDestroy() {
      this.clearPool()
      return true
    },
    methods: {
      ...mapMutations({
        clearPool: 'pool/clear'
      })
    }
  }
</script>
