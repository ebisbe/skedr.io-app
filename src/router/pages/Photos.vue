<template>
    <v-content>
        <v-progress-linear height="3" class="my-0" v-bind:indeterminate="true" v-if="loading"></v-progress-linear>
        <v-container fluid grid-list-xl>
            <h4>Photostream</h4>
            <v-layout row wrap>
                <v-flex md3 sm4 xs6 v-for="photo in userPhotos" :key="photo.id">
                    <photo :photo="photo"></photo>
                </v-flex>
            </v-layout>
        </v-container>
    </v-content>
</template>
<script>
  import gql from 'graphql-tag'
  import Photo from '../../components/Photo.vue'

  export default {
    name: 'Photos',
    components: { Photo },
    data () {
      return {
        userPhotos: [],
        loading: 0
      }
    },
    apollo: {
      userPhotos: {
        query: gql `query userPhotos($userId: ID!){
  userPhotos(userId: $userId, first: 20) {
    id
    photoId
    title
    views
    url_m
    url_sq
  }
  }`,
        variables: {
          userId: '144521588@N08'
        },
        update: data => data.userPhotos,
        fetchPolicy: 'cache-and-network',
        loadingKey: 'loading'
      }
    }
  }
</script>
