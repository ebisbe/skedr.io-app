<template>
    <v-content>
        <v-progress-linear height="3" class="my-0" v-bind:indeterminate="true" v-if="loading"></v-progress-linear>
        <v-container fluid grid-list-xl>
            <v-layout row wrap v-if="searchImages === ''">
                <v-flex  md3 sm4 xs6 v-for="photo in userPhotos" :key="photo.id">
                    <photo :photo="photo"></photo>
                </v-flex>
            </v-layout>
            <v-layout v-else>
                <my-fetch :url="searchImages" method="post" :data="{text: search}">
                    <transition-group name="list" tag="div" class="layout wrap" slot-scope="data">
                        <v-flex md3 sm4 xs6 v-for="photo in data.photo" :key="photo.id">
                            <photo :photo="photo"></photo>
                        </v-flex>
                    </transition-group>
                </my-fetch>
            </v-layout>
        </v-container>
    </v-content>
</template>
<script>
  import gql from 'graphql-tag'
  import Photo from '../../components/Photo.vue'
  import { mapState, mapGetters } from 'vuex'

  export default {
    name: 'Photos',
    components: {Photo},
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
        variables () {
          return {
            userId: this.userId
          }
        },
        update: data => data.userPhotos,
        fetchPolicy: 'cache-and-network',
        loadingKey: 'loading'
      }
    },
    computed: {
      searchImages () {
        if (this.search === '') {
          return ''
        }
        return 'search'
      },
      ...mapGetters(['userId']),
      ...mapState(['search'])
    }
  }
</script>
