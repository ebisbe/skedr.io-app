<template>
    <v-list two-line>
        <v-subheader>Scheduled photos</v-subheader>
        <scheduled-media
                v-for="photo in scheduled"
                :key="photo.photoId"
                :photo="photo"></scheduled-media>
    </v-list>
</template>
<script>
  import ScheduledMedia from './ScheduledMedia.vue'
  import { getSignedRequest } from '../libs/awsLib'

  export default {
    name: 'Scheduled',
    components: {ScheduledMedia},
    data () {
      return {
        scheduled: []
      }
    },
    created () {
      this.fetchData()
    },
    methods: {
      async fetchData () {
        this.axios(await getSignedRequest('scheduled'))
          .then((response) => {
            this.scheduled = response.data
          })
      }
    }
  }
</script>