<template>
  <base-photo
    :url="url"
    :lazy-url="url_q"
    :is-private="!photo.photo.isPublic"
    :class="{ 'pa-3 selected': inPool(payload.id) }"
    :is-selected="inPool(payload.id)"
    :is-user-selecting="hasItems && deleted !== true"
    :selectable="!deleted"
    @click.native="
      !inPool(payload.id) && deleted !== true ? addToPool(payload) : removeFromPool(payload.id)
    "
  >
    <template v-slot:footer>
      <v-tooltip v-if="deleted" left>
        <template v-slot:activator="{ on }">
          <v-icon large class="warning--text deleted" v-on="on">
            delete
          </v-icon>
        </template>
        <span v-t="'Layout.scheduled_to_delete'" />
      </v-tooltip>
      <footer-photo :title="photo.photo.title" />
    </template>
  </base-photo>
</template>
<script>
  import BasePhoto from './BasePhoto.vue'
  import FooterPhoto from './FooterPhoto.vue'
  import { scheduledAt } from '@/mixins'
  import { mapGetters, mapMutations } from 'vuex'

  export default {
    components: { BasePhoto, FooterPhoto },
    mixins: [scheduledAt],
    props: {
      photo: {
        type: Object,
        required: true
      }
    },
    computed: {
      url() {
        return this.composeUrl()
      },
      url_q() {
        return this.composeUrl('_q')
      },
      deleted() {
        return this.photo.preventTrigger
      },
      payload() {
        return {
          id: `${this.photo.groupId}-${this.photo.photoId}`,
          item: this.photo
        }
      },
      ...mapGetters({
        inPool: 'schedulerPool/inPool',
        hasItems: 'schedulerPool/hasItems'
      })
    },
    methods: {
      composeUrl(size = '') {
        const {
          photoId,
          photo: { server, farm, secret }
        } = this.photo
        return `https://farm${farm}.staticflickr.com/${server}/${photoId}_${secret}${size}.jpg`
      },
      ...mapMutations({
        addToPool: 'schedulerPool/add',
        removeFromPool: 'schedulerPool/remove'
      })
    }
  }
</script>
<style scoped>
  .deleted {
    position: absolute;
    top: 8px;
    right: 8px;
  }
</style>
