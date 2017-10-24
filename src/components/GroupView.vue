<template>
    <md-layout md-gutter>
        <md-layout md-column md-gutter v-if="group">
            <md-layout md-flex="20">
                <h1 v-html="title"></h1>
                <p v-html="group.description._content"></p>
            </md-layout>
            <md-layout md-row>
                <md-card>
                    <md-card md-with-hover
                             v-if="relatedPhotos"
                             v-for="photo in relatedPhotos.photo"
                             :key="photo.nsid">
                        <md-card-media-cover md-text-scrim>
                            <md-card-media md-ratio="16:9">>
                                <img :src="urlPhoto(photo)" alt="People">
                            </md-card-media>

                            <md-card-area>
                                <md-card-header>
                                    <div class="md-title">Title goes here</div>
                                    <div class="md-subhead">Subtitle here</div>
                                </md-card-header>

                                <md-card-actions>
                                    <md-button>Action</md-button>
                                    <md-button>Action</md-button>
                                </md-card-actions>
                            </md-card-area>
                        </md-card-media-cover>
                        </md-card-media-cover>
                    </md-card>
                </md-card>
            </md-layout>
        </md-layout>
    </md-layout>
</template>
<script>
  import { getSignedRequest } from '../libs/awsLib'
  import { url } from '../mixins/urlPhoto.js'

  export default {
    name: 'GroupView',
    mixins: [url],
    data () {
      return {
        group: null,
        relatedPhotos: null,
        size: 'm'
      }
    },
    watch: {
      // call again the method if the route changes
      '$route': 'fetchData'
    },
    created () {
      this.fetchData()
    },
    methods: {
      fetchData: async function () {
        this.axios(await getSignedRequest('groups/' + this.$route.params.group_id))
          .then((response) => {
            this.group = response.data
          })
          .catch(function (error) {
            console.log(error)
          })
        this.axios(await getSignedRequest('groups/pool/' + this.$route.params.group_id))
          .then((response) => {
            this.relatedPhotos = response.data
          })
          .catch(function (error) {
            console.log(error)
          })
      }
    },
    computed: {
      title: function () {
        return this.group.name._content + ' ' + this.group.throttle.remaining + '/' + this.group.throttle.count
      }
    }
  }
</script>