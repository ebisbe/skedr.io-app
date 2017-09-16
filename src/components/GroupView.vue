<template>
    <div class="container">

        <div class="row" v-if="group">
            <h1 v-html="title"></h1>
            <p v-html="group.description._content"></p>
        </div>
        <b-card>
            <b-card-group columns v-if="relatedPhotos">
                <photo
                        v-for="photo in relatedPhotos.photo"
                        :photo="photo"
                        size="n"
                        :key="photo.nsid"
                ></photo>
            </b-card-group>
        </b-card>
    </div>
</template>
<script>
  import { getSignedRequest } from '../libs/awsLib'

  export default {
    name: 'GroupView',
    data () {
      return {
        group: null,
        relatedPhotos: null
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