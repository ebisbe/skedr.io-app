<template>
  <v-content>
    <v-container
      fluid
      grid-list-md
      pb-0>
      <h1>
        <v-btn
          icon
          ripple
          flat
          @click.stop="$router.push({name: 'Groups'})">
          <v-icon color="grey lighten-1">keyboard_arrow_left</v-icon>
        </v-btn> <span v-html="title"/>
      </h1>
    </v-container>
    <ApolloQuery
      :query="require('@/graphql/groupPhotos.gql')"
      :variables="{
        groupId: $route.params.groupId
      }"
      tag=""
    >
      <template slot-scope="{ result: { error, data } , isLoading, query}">
        <!-- Loading -->
        <q-empty
          v-if="isLoading && data === null"
          :loading="true"/>

        <!-- Error -->
        <q-empty
          v-else-if="error"
          :error="true"
          icon="perm_media"/>

        <!-- Result -->
        <v-container
          v-else-if="data.groupPhotos.photos.length"
          fluid
          grid-list-md>

          <v-layout row wrap>
            <v-flex
              v-for="photo in data.groupPhotos.photos"
              :key="photo.id"
              md4
              sm6
              xs12>
              <q-photo :photo="photo" />
            </v-flex>
          </v-layout>
        </v-container>

        <!-- No result -->
        <q-empty
          v-else
          description="You don't have any photo added in this group"
          icon="perm_media"/>
      </template>
    </ApolloQuery>

  </v-content>
</template>
<script>
import QPhoto from '@/components/ui/QPhoto'
import QEmpty from '@/components/ui/QEmpty'

export default {
  components: { QPhoto, QEmpty },
  computed: {
    title() {
      const { title = '' } = this.$route.params
      if (title === '') {
        return localStorage.getItem('groupViewPage')
      } else {
        localStorage.setItem('groupViewPage', title)
        return title
      }
    }
  }
}
</script>
