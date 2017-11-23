<template>
    <v-layout row wrap>
        <v-flex md3 sm4 xs6
                v-for="photo in photos"
                :key="photo.id">
            <photo :photo="photo"></photo>
        </v-flex>
    </v-layout>
</template>
<script>
  import { mapState } from 'vuex'
  import Photo from './Photo.vue'
  import gql from 'graphql-tag'

  export default {
    name: 'GroupView',
    components: {Photo},
    props: {
      groupId: {
        type: String,
        required: true
      }
    },
    data () {
      return {
        photos: [],
        loading: 0
      }
    },
    apollo: {
      photos: {
        query: gql `query photos ($userId: ID!, $groupId: ID!){
  groupPhotos(groupId: $groupId, userId: $userId, first: 20) {
    id
    photoId
    title
    views
    url_m
    url_s
  }
}`,
        variables () {
          return {
            userId: this.userId,
            groupId: this.groupId
          }
        },
        update: data => data.groupPhotos,
        loadingKey: 'loading',
        fetchPolicy: 'cache-and-network'
      }
    },
    computed: {
      ...mapState([
        'userId'
      ])
    },
    watch: {
      loading (value) {
        this.$emit('isLoading', value)
      }
    }
  }
</script>
