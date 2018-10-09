<template>
  <v-content>
    <v-container
      fluid
      grid-list-md>
      <h1>
        <v-btn
          icon
          ripple
          flat
          @click.stop="$router.push({name: 'Group'})">
          <v-icon color="grey lighten-1">keyboard_arrow_left</v-icon>
        </v-btn> <span v-html="title"/>
      </h1>
      <v-card class="mb-3">
        <group-tags
          v-if="tags.length > 1"
          :user-id="userId"
          :group-id="$route.params.groupId"
          :tags="tags"
          @selectedTag="selected"/>
      </v-card>
      <v-layout row wrap>
        <v-flex
          v-for="photo in photos"
          :key="photo.id"
          md4
          sm6
          xs12>
          <q-photo :photo="photo" :tag="selectedTag"/>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>
<script>
import { mapGetters } from 'vuex'

import QPhoto from '@/components/ui/QPhoto'
import GroupTags from '@/components/group/GroupTags'
import Tag from '@/classes/Tag'
import GROUP_PHOTOS from '@/graphql/groupPhotos.gql'
import _sortBy from 'lodash/sortBy'

export default {
  name: 'GroupViewPage',
  components: { QPhoto, GroupTags },
  data() {
    return {
      photos: [],
      tags: [],
      selectedTag: ''
    }
  },
  apollo: {
    photos: {
      query: GROUP_PHOTOS,
      variables() {
        return {
          userId: this.userId,
          groupId: this.$route.params.groupId
        }
      },
      update: ({ groupPhotos }) => groupPhotos
    }
  },
  computed: {
    ...mapGetters({ userId: 'user/userId' }),
    title() {
      const { title = '' } = this.$route.params
      if (title === '') {
        return localStorage.getItem('groupViewPage')
      } else {
        localStorage.setItem('groupViewPage', title)
        return title
      }
    }
  },
  watch: {
    photos(photos) {
      const tagsArr = new Object()
      photos.forEach(({ tags }) => {
        tags.split(' ').forEach(tagName => {
          let tag = !tagsArr.hasOwnProperty(tagName) ? new Tag(tagName, 0, this.photos.length) : tagsArr[tagName]
          tag.add()
          tagsArr[tagName] = tag
        })
      })
      this.tags = _sortBy(tagsArr, ['count']).reverse()
    }
  },
  methods: {
    selected(name) {
      this.selectedTag = name
    }
  }
}
</script>
