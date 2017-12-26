<template>
    <v-card>
        <v-card-text v-if="loading" style="text-align: center">
            <v-progress-circular
                    :size="100"
                    :width="15"
                    :rotate="360"
                    :value="progressToHundred"
                    color="teal"
            >
                {{ progress }}
            </v-progress-circular>
        </v-card-text>
    </v-card>
</template>
<script>
  import { signReq } from '../libs/aws-lib'

  export default {
    name: 'PushPhotos',
    props: {
      pool: {
        type: Array,
        required: true
      },
      groups: {
        type: Array,
        required: true
      }
    },
    data () {
      return {
        race: 0,
        photosToPush: [],
        loading: false
      }
    },
    created () {
      this.pushPhotosToGroups()
    },
    computed: {
      progress () {
        return `${this.race} / ${this.photosToPush.length}`
      },
      progressToHundred () {
        return (this.race * 100) / this.photosToPush.length || 0
      }
    },
    methods: {
      pushPhotosToGroups () {
        this.loading = true
        this.photosToPush = []
        this.race = 0

        for (const group of this.groups) {
          for (const photo of this.pool) {
            const payload = {
              /** BACKWARDS COMPATIBILITY **/
              photoId: photo.photoId !== undefined ? photo.photoId : photo.id,
              /** END **/
              groupId: group.groupId,
              secret: photo.secret
            }
            this.photosToPush.push(this.axios(signReq('pool', '', payload, 'post')).then(() => this.race++))
          }
        }

        Promise.all(this.photosToPush)
          .then(() => {
            setTimeout(() => { this.loading = false }, 2000)
          })
          .catch(error => console.log(error))
      }
    },
    watch: {
      loading (value) {
        if (value) {
          this.$emit('loading')
        } else {
          this.$emit('loaded')
        }
      }
    }
  }
</script>