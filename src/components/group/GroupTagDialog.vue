
<template>
  <v-dialog
    v-model="manageTags"
    lazy
    width="500"
    scrollable
  >
    <v-card>
      <v-toolbar dark color="primary">
        <v-toolbar-title>
          Manage Tags '<strong v-html="title"/>'
        </v-toolbar-title>
        <v-spacer/>
      </v-toolbar>
      <div class="pa-3">
        <v-combobox
          v-model="comboTags"
          multiple
          label="Add a tag"
          hide-details
          @keyup.shift.enter="save"
        >
          <group-tag-dialog-chip
            slot="selection"
            slot-scope="{ item, parent, selected }"
            :tag="item"
            :selected="selected"
            :photo-tags-list="photoTagsList"
            @click="parent.selectItem(item)"
          />
        </v-combobox>
        <!-- <v-switch
          v-model="newPhotosOnly"
          :hint="newPhotosOnly ? `Only new photos from your photostream will be added.` : `All photos with the chosen tags will be added.`"
          color="primary"
          label="Import only new photos"
          persistent-hint
        /> -->
      </div>
      <v-card-text v-if="photoTagsList !== null && photoTagsList.length" class="pt-0">
        <v-container
          grid-list-xs
          pa-0
          fluid>
          <v-layout row wrap>
            <v-subheader class="xs12 flex">Photos with&nbsp;<strong>[{{ comboTags.join(', ') }}]</strong></v-subheader>
            <v-flex
              v-for="{photoId, secret, photo: {farm, server}} in list"
              :key="secret"
              xs2
            >
              <v-card flat tile>
                <group-tag-dialog-image
                  :photo-id="photoId"
                  :secret="secret"
                  :farm="farm"
                  :server="server"/>
              </v-card>
            </v-flex>
          </v-layout>
          <v-btn
            v-if="show <= photoTagsList.length"
            small
            @click="show += 12">show more</v-btn>
        </v-container>
      </v-card-text>
      <v-divider/>

      <v-card-actions>
        <v-spacer/>
        <v-btn
          color="primary"
          flat
          @click="$emit('close')"
        >
          cancel
        </v-btn>
        <v-btn
          :disabled="!canSave"
          color="primary"
          @click="save"
        >
          save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import PHOTO_TAG_LIST from '@/graphql/photoTagsList.gql'
import { GroupTagDialogChip, GroupTagDialogImage } from '@/components/group'

export default {
  components: { GroupTagDialogChip, GroupTagDialogImage },
  props: {
    title: {
      type: String,
      required: true
    },
    manageTags: {
      type: Boolean,
      required: true
    },
    tags: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    comboTags: [],
    newPhotosOnly: false,
    photoTagsList: null,
    show: 18
  }),
  computed: {
    canSave() {
      const set = new Set(this.tags)
      this.comboTags.forEach(tag => (!set.has(tag) ? set.add(tag) : null))
      return (
        this.comboTags.length !== this.tags.length ||
        (this.comboTags.length === this.tags.length && set.size > this.comboTags.length)
      )
    },
    list() {
      if (this.photoTagsList !== null) return this.photoTagsList.slice(0, this.show)
      return []
    }
  },
  created() {
    this.comboTags = this.tags.slice()
  },
  methods: {
    save() {
      if (this.canSave) {
        this.$emit('update', this.comboTags)
      }
    }
  },
  apollo: {
    photoTagsList: {
      query: PHOTO_TAG_LIST,
      fetchPolicy: 'network',
      update({ photoTagsList }) {
        this.show = 18
        return photoTagsList
      },
      variables() {
        return {
          tags: this.comboTags
        }
      },
      skip() {
        return !this.manageTags || this.comboTags.length === 0
      }
    }
  }
}
</script>
