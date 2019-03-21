<template>
  <v-dialog
    v-model="manageTags"
    lazy
    persistent
    width="500"
    scrollable
  >
    <v-card>
      <v-toolbar dark color="primary">
        <v-btn icon @click.native="$emit('close')">
          <v-icon>close</v-icon>
        </v-btn>
        <v-toolbar-title>
          Manage Tags
        </v-toolbar-title>
        <v-spacer/>
      </v-toolbar>
      <div class="pa-3">
        <div class="xs12 flex headline" v-html="title"/>
        <v-combobox
          v-model="comboTags"
          multiple
          label="Tags"
          hint="Use lowercase letters and numbers."
          @keyup.shift.enter="() => { if(canSave) { $refs.saveBtn.click({}) } }"
        >
          <group-tag-dialog-chip
            slot="selection"
            slot-scope="{ item }"
            :tag="item"
            @click="remove(item)"
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
      <v-card-text v-if="comboTags">
        <v-expansion-panel>
          <ApolloQuery
            v-for="tag in comboTags"
            :key="tag"
            :query="require('@/graphql/photoTagsList.gql')"
            :variables="{
              tags: [tag]
            }"
            tag=""
          >
            <template slot-scope="{ result: { loading, error, data } }">
              <v-expansion-panel-content>
                <div slot="header">{{ tag }} <span v-if="data">[{{ data.photoTagsList.length }}]</span></div>
                <v-card>
                  <v-card-text>
                    <v-container
                      grid-list-xs
                      fluid
                      pa-0>
                      <v-layout row wrap>
                        <!-- Loading -->
                        <div v-if="loading && data === undefined" class="loading apollo">Loading...</div>

                        <!-- Error -->
                        <div v-else-if="error" class="error apollo">We couldn't fetch your data.</div>

                        <!-- Result -->
                        <v-flex
                          v-for="{photoId, photo: {secret, farm, server}} in data.photoTagsList"
                          v-else-if="data && data.photoTagsList.length"
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

                        <!-- No result -->
                        <div v-else class="no-result apollo">You don't have photos with '{{ tag }}' tag.</div>
                      </v-layout>
                    </v-container>
                  </v-card-text>
                </v-card>
              </v-expansion-panel-content>
            </template>
          </ApolloQuery>
        </v-expansion-panel>
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
        <ApolloMutation
          :mutation="require('@/graphql/mutations/updateGroupTagsList.gql')"
          :variables="{
            groupId: groupId,
            tags: comboTags
          }"
          tag=""
          @done="$emit('close')"
        >
          <template slot-scope="{ mutate, loading, error }">
            <v-btn
              ref="saveBtn"
              :disabled="!canSave || loading"
              :loading="loading"
              color="primary"
              @click="mutate()"
            >
              save
            </v-btn>
            <p v-if="error">We couldn't fetch your data.</p>
          </template>
        </ApolloMutation>

      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { GroupTagDialogChip, GroupTagDialogImage } from '@/components/group'
import { filters } from '@/mixins'

export default {
  components: { GroupTagDialogChip, GroupTagDialogImage },
  mixins: [filters],
  props: {
    groupId: {
      type: String,
      required: true
    },
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
    comboTagsReal: [],
    newPhotosOnly: false
  }),
  computed: {
    comboTags: {
      set(value) {
        this.comboTagsReal = value.map(val => this.sanitize(val)).slice()
      },
      get() {
        return this.comboTagsReal
      }
    },
    canSave() {
      const set = new Set(this.tags.map(tag => this.sanitize(tag)))
      this.comboTags.forEach(tag => {
        const sanitizedTag = this.sanitize(tag)
        !set.has(sanitizedTag) ? set.add(sanitizedTag) : null
      })
      return (
        this.comboTags.length !== this.tags.length ||
        (this.comboTags.length === this.tags.length && set.size > this.comboTags.length)
      )
    }
  },
  created() {
    this.comboTags = this.tags.slice()
  },
  methods: {
    remove(tagToRemove) {
      this.comboTags = this.comboTags.filter(tags => tags !== tagToRemove)
    }
  }
}
</script>
