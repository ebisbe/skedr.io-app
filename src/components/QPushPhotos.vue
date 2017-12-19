<template>
    <v-card>
        <v-card-title class="headline">Add photos to selected groups?</v-card-title>
        <v-card-text v-if="loading">
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
        <v-card-text v-else>
            Confirming will add all the photos to each group and schedule all the ones can not be
            added.
            <v-list subheader>
                <v-list-tile avatar v-for="group in selectedGroups" :key="group.title">
                    <v-list-tile-avatar>
                        <img :src="group.icon"/>
                    </v-list-tile-avatar>
                    <v-list-tile-content>
                        <v-list-tile-title v-html="group.title"></v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="secondary--text" flat @click.native="$emit('cancel')">Cancel</v-btn>
            <v-btn class="secondary--text" flat @click.native="pushPhotosToGroups()">OK</v-btn>
        </v-card-actions>
    </v-card>
</template>
<script>
  import { mapState } from 'vuex'
  import { signReq } from '../libs/aws-lib'

  export default {
    name: 'PushPhotos',
    data () {
      return {
        race: 0,
        photosToPush: [],
        loading: false
      }
    },
    computed: {
      ...mapState([
        'pool',
        'selectedGroups'
      ]),
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
        for (const group of this.selectedGroups) {
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
            this.$emit('photosPushed')
            this.photosToPush = []
            this.race = 0
            this.loading = false
          })
          .catch(error => console.log(error))
      }
    }
  }
</script>