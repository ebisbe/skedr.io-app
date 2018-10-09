<template>
  <v-layout row wrap>
    <v-flex xs9 class="pa-2">
      <span v-if="selectedTags.length">
        <q-chip
          v-for="tag in selectedTags"
          :key="tag.value"
          :tag="tag"
          @selectedTag="selected"/>
      </span>
      <span 
        v-else 
        class="pa-2" 
        style="display:block">
        You don't have any tag selected to autoimport photos to this group
      </span>
      <q-popup
        :data="tags"
        :dialog="dialog"
        toolbar-title="Choose tags"
        item-text="value"
        @close="dialog = false">
        <tags-dialog-list
          slot="list"
          slot-scope="props"
          :key="props.item.value"
          :tag="props.item"/>
        <q-push
          slot="save"
          slot-scope="props"
          :requests="constructPayload(props.selectedData)"
          style="margin-bottom: 56px"
          @loaded="loaded"
        />
      </q-popup>
    </v-flex>
    <v-flex xs3 class="text-xs-right">
      <v-btn @click="dialog = true">Add</v-btn>
    </v-flex>
  </v-layout>
</template>
<script>
import QChip from '@/components/ui/QChip'
import QPopup from '@/components/ui/QPopup'
import QPush from '@/components/ui/QPush'
import TagsDialogList from '@/components/dialog/TagsDialogList'
import AUTOIMPORT_TAGS from '@/graphql/autoimportTags.gql'

export default {
  components: { QChip, QPopup, QPush, TagsDialogList },
  props: {
    userId: {
      type: String,
      required: true
    },
    groupId: {
      type: String,
      required: true
    },
    tags: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    dialog: false,
    autoimportTags: []
  }),
  apollo: {
    autoimportTags: {
      query: AUTOIMPORT_TAGS,
      variables() {
        return {
          userId: this.userId,
          groupId: this.groupId
        }
      },
      update: function({ autoimportTags }) {
        //TODO GraphQl query should be rethinked
        const response = autoimportTags.length > 0 ? autoimportTags[0].tags : []

        this.tags.forEach(tag => {
          if (response.indexOf(tag.name) !== -1) {
            tag.selected = true
          }
        })
        return response
      }
    }
  },
  computed: {
    selectedTags() {
      return this.tags.filter(tag => this.autoimportTags.indexOf(tag.name) !== -1)
    }
  },
  methods: {
    constructPayload(tags) {
      const payload = {
        body: {
          tags: tags.map(tag => tag.value),
          userId: this.userId,
          groupId: this.groupId
        }
      }
      return [{ path: '/tags', payload }]
    },
    loaded() {
      //this.$apollo.queries.photos.refetch()
      this.$apollo.queries.autoimportTags.refetch()
      this.dialog = false
    },
    selected(name) {
      this.$emit('selectedTag', name)
    }
  }
}
</script>
