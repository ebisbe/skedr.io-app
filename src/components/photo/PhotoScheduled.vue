<template>
  <base-photo
    :height="height"
    :url="url"
    :lazy-url="url_sq"
    :is-private="!photo.photo.isPublic">
    <template v-slot:footer>
      <footer-photo :title="photo.photo.title">
        <template v-slot:action>
          <v-list-tile-action>
            <ApolloMutation
              :mutation="require('@/graphql/mutations/deleteScheduledPhoto.gql')"
              :variables="{ groupId: photo.groupId, photoId: photo.photoId }"
              tag=""
            >
              <template slot-scope="{ mutate, loading, error }">
                <v-tooltip
                  top
                  lazy>
                  <v-btn
                    slot="activator"
                    :disabled="loading || photo.preventTrigger"
                    :loading="loading"
                    class="mx-1"
                    icon
                    @click="mutate()">
                    <v-icon>delete</v-icon>
                  </v-btn>
                  <span v-if="photo.preventTrigger">Deleting from queue</span>
                  <span v-else-if="error" class="error--text">Some error occured!</span>
                  <span v-else>Remove from queue</span>
                </v-tooltip>
              </template>
            </ApolloMutation>
          </v-list-tile-action>
        </template>
      </footer-photo>
    </template>
  </base-photo>
</template>
<script>
import BasePhoto from './BasePhoto.vue'
import FooterPhoto from './FooterPhoto.vue'
import { scheduledAt } from '@/mixins'

export default {
  components: { BasePhoto, FooterPhoto },
  mixins: [scheduledAt],
  props: {
    photo: {
      type: Object,
      required: true
    },
    height: {
      type: Number,
      required: false,
      default: 205
    }
  },
  computed: {
    url() {
      return this.composeUrl()
    },
    url_sq() {
      return this.composeUrl('_sq')
    }
  },
  methods: {
    composeUrl(size = '') {
      const {
        photoId,
        photo: { server, farm, secret }
      } = this.photo
      return `https://farm${farm}.staticflickr.com/${server}/${photoId}_${secret}${size}.jpg`
    }
  }
}
</script>
