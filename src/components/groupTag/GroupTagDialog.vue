<template>
  <v-dialog
    v-model="manageTags"
    lazy
    persistent
    width="500"
    scrollable
    no-click-animation
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
          :items="suggestedTags"
          item-text="name"
          hide-selected
          persistent-hint
          multiple
          label="Tags"
          hint="Use lowercase letters and numbers."
          @keyup.shift.enter="() => { if(canSave) { $refs.saveBtn.click({}) } }"
        >
          <group-tag-dialog-chip
            slot="selection"
            slot-scope="{ item }"
            :tag="typeof item === 'object' ? item.name : item"
            @click="remove(item)"
          />
          <template v-slot:item="{ index, item }">
            <v-list-tile-content>
              {{ item.name | ucFirst }}
            </v-list-tile-content>
            <v-list-tile-action>
              <v-tooltip left lazy>
                <template v-slot:activator="{ on }">
                  <v-btn
                    icon
                    v-on="on">
                    {{ parseInt(item.count / item.total * 100) }}%
                  </v-btn>
                </template>
                <span>
                  {{ item.count }} / {{ item.total }} photos have the '{{ item.name }}' tag.
                </span>
              </v-tooltip>
            </v-list-tile-action>
          </template>
          <template v-slot:no-data>
            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-title>
                  We couldn't suggest tags. Press <kbd>enter</kbd> to add one.
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </template>
        </v-combobox>
        <v-switch
          v-model="preventTrigger"
          :hint="hint"
          color="primary"
          label="Import only new photos"
          persistent-hint
        />
      </div>
      <v-card-text v-if="comboTags">
        <v-expansion-panel v-model="openedPanel">
          <ApolloQuery
            v-for="tag in comboTags"
            :key="tag"
            :query="require('@/graphql/searchPhotos.gql')"
            :variables="{
              tags: tag,
              perPage,
              page
            }"
            tag=""
          >
            <template slot-scope="{ result: { loading, error, data } }">
              <v-expansion-panel-content>
                <div slot="header">{{ tag }} <span v-if="data">[{{ data.searchPhotos.total }}]</span></div>
                <v-card>
                  <v-card-text class="grey lighten-4">
                    <v-container
                      grid-list-xs
                      fluid
                      pa-0>
                      <!-- Loading -->
                      <div v-if="loading && data === undefined" class="loading apollo">Loading...</div>

                      <!-- Error -->
                      <div v-else-if="error" class="error apollo">We couldn't fetch your data.</div>

                      <!-- Result -->
                      <v-layout
                        v-else-if="data && data.searchPhotos.photos.length"
                        row
                        wrap
                      >
                        <v-flex
                          v-for="{photoId, secret, farm, server} in data.searchPhotos.photos"
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
                        <v-flex class="text-xs-center xs12">
                          <v-pagination
                            v-model="page"
                            :length="Math.ceil(data.searchPhotos.total / perPage)"
                            total-visible="6"
                          />
                        </v-flex>
                      </v-layout>

                      <!-- No result -->
                      <div v-else class="no-result apollo">You don't have photos with '{{ tag }}' tag.</div>
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
            tags: comboTags,
            preventTrigger
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
import { GroupTagDialogChip, GroupTagDialogImage } from '@/components/groupTag'
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
    preventTrigger: true,
    openedPanel: null,
    perPage: 18,
    page: 1,
    suggestedTags: []
  }),
  computed: {
    hint() {
      return this.preventTrigger
        ? `Adds only new photos from your photostream. If you want to add all your current photos matching <strong>[${
            this.comboTags
          }]</strong> disable this option.`
        : `All photos matching <strong>[${
            this.comboTags
          }]</strong> will be added. You can review which photos will be added below.`
    },
    comboTags: {
      set(value) {
        this.comboTagsReal = value
          .map(val => (typeof val === 'object' ? val.name : val))
          .map(val => this.sanitize(val))
          .slice()
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
  watch: {
    tags(tags) {
      this.comboTagsReal = tags
    }
  },
  created() {
    this.comboTags = this.tags.slice()
  },
  apollo: {
    suggestedTags: {
      query: require('@/graphql/suggestedTags.gql'),
      variables() {
        return {
          groupId: this.groupId
        }
      },
      skip() {
        return !this.manageTags
      }
    }
  },
  methods: {
    remove(tagToRemove) {
      this.comboTags = this.comboTags.filter(tags => tags !== tagToRemove)
    }
  }
}
</script>