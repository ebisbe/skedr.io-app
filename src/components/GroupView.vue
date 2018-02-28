<template>
  <v-layout row wrap>
    <v-flex xs10>
      <span v-if="autoimportTags.length">
        <q-chip
          :key="tag.value"
          :tag="tag"
          @selectedTag="selected"
          v-for="tag in selectedTags"/>
      </span>
      <span v-else>
        You don't have any tag selected to autoimport photos to this group
      </span>
    </v-flex>
    <v-flex xs2 class="text-xs-right">
      <v-btn @click="dialog = true">Add</v-btn>
    </v-flex>
    <q-popup
      :data="tags"
      toolbar-title="Choose tags"
      :dialog="dialog"
      item-text="value"
      @close="dialog = false">
      <q-tags-dialog-list
        slot="list"
        slot-scope="props"
        :key="props.item.value"
        :tag="props.item"/>
      <q-push
        slot="save"
        slot-scope="props"
        :requests="constructPayload(props.selectedData)"
        @loaded="dialog = false"
      />
    </q-popup>
    <v-flex
      md3
      sm4
      xs6
      v-for="photo in photos"
      :key="photo.id">
      <photo :photo="photo" :tag="selectedTag"/>
    </v-flex>
  </v-layout>
</template>
<script>
import { mapGetters } from 'vuex'
import { signReq } from '../libs/aws-lib'

import Photo from './Photo'
import QChip from './QChip'
import QPopup from './QPopup'
import QTagsDialogList from './QTagsDialogList'
import QPush from './QPush'

import GROUP_PHOTOS from '../graphql/groupPhotos.gql'
import AUTOIMPORT_TAGS from '../graphql/autoimportTags.gql'

import _sortBy from 'lodash/sortby'

export default {
  name: 'GroupView',
  components: { Photo, QChip, QTagsDialogList, QPopup, QPush },
  props: {
    groupId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      photos: [],
      loading: 0,
      tags: [],
      autoimportTags: [],
      selectedTag: '',
      dialog: false
    }
  },
  apollo: {
    photos: {
      query: GROUP_PHOTOS,
      variables() {
        return {
          userId: this.userId,
          groupId: this.groupId
        }
      },
      update: ({ groupPhotos }) => groupPhotos,
      loadingKey: 'loading',
      fetchPolicy: 'cache-and-network'
    },
    autoimportTags: {
      query: AUTOIMPORT_TAGS,
      variables() {
        return {
          userId: this.userId,
          groupId: this.groupId
        }
      },
      update: ({ autoimportTags }) => {
        //TODO GraphQl query should be rethinked
        return autoimportTags.length > 0 ? autoimportTags[0].tags : []
      },
      loadingKey: 'loading',
      fetchPolicy: 'cache-and-network'
    }
  },
  computed: {
    ...mapGetters(['userId']),
    selectedTags() {
      return this.tags.filter(tag => this.autoimportTags.indexOf(tag.value) !== -1)
    }
    /*usefulTags() {
      return this.tags.filter(tag => tag.count / this.photos.length * 100 > 74)
    }*/
  },
  watch: {
    loading(value) {
      this.$emit('isLoading', value)
    },
    photos(photos) {
      const tagsArr = []
      photos.forEach(photo => {
        tagsArr.push(...photo.tags.split(' '))
      })
      this.tags = this.compressArray(tagsArr.filter(item => item !== ''))
    }
  },
  methods: {
    selected(name) {
      this.selectedTag = name
    },
    compressArray(original) {
      const compressed = []

      while (original.length > 0) {
        let tag = new Object({ selected: false })
        tag.value = original.shift()
        let prevLength = original.length
        original = original.filter(item => item !== tag.value)
        tag.count = 1 + (prevLength - original.length)
        tag.total = this.photos.length
        tag.percentage = function() {
          return Math.round(this.count / this.total * 100)
        }
        compressed.push(tag)
      }

      return _sortBy(compressed, 'count').reverse()
    },
    constructPayload(tags) {
      const payload = {
        tags: tags.map(tag => tag.value),
        userId: this.userId,
        groupId: this.groupId
      }
      return [signReq('tags', '', payload, 'post')]
    }
  }
}
</script>
