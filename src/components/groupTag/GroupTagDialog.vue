<template>
  <v-dialog
    v-model="manageTags"
    persistent
    transition="dialog-bottom-transition"
    width="500"
    scrollable
    no-click-animation
  >
    <v-card>
      <v-toolbar color="primary">
        <v-btn icon color="white" @click.native="$emit('close')">
          <v-icon>close</v-icon>
        </v-btn>
        <v-toolbar-title v-t="'GroupTag.title'" class="white--text" />
      </v-toolbar>
      <div class="pa-4">
        <div class="xs12 flex headline mb-3">
          {{ title }}
        </div>
        <v-combobox
          v-model="comboTags"
          :items="suggestedTags"
          item-text="name"
          hide-selected
          persistent-hint
          dense
          clearable
          multiple
          label="Tags"
          hint="Use lowercase letters and numbers."
          @keyup.shift.enter="
            () => {
              if (canSave) {
                $refs.saveBtn.click({})
              }
            }
          "
        >
          <group-tag-dialog-chip
            slot="selection"
            slot-scope="{ item }"
            :tag="typeof item === 'object' ? item.name : item"
            @click="remove(item)"
          />
          <template v-slot:item="{ index, item }">
            <v-list-item-content>
              {{ item.name | ucFirst }}
            </v-list-item-content>
            <v-list-item-action>
              <v-tooltip left>
                <template v-slot:activator="{ on }">
                  <v-btn icon v-on="on"> {{ parseInt((item.count / item.total) * 100) }}% </v-btn>
                </template>
                <span>
                  {{ $t('GroupTag.count_tags', item) }}
                </span>
              </v-tooltip>
            </v-list-item-action>
          </template>
          <template v-slot:no-data>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>{{ $t('GroupTag.no_data') }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-combobox>
        <v-switch
          v-model="preventTrigger"
          :hint="hint"
          :label="$t('GroupTag.only_new_photos')"
          color="primary"
          persistent-hint
        />
        <v-switch
          v-model="useAnd"
          :hint="useAndHint"
          :label="$t('GroupTag.use_and')"
          color="primary"
          persistent-hint
        />
      </div>
      <v-card-text v-if="comboTags">
        <v-expansion-panels v-model="openedPanel">
          <ApolloQuery
            v-for="tag in tagsForSearch"
            :key="tag"
            :query="require('@/graphql/searchPhotos.gql')"
            :variables="{
              tags: tag,
              perPage,
              page,
              useAnd
            }"
            tag=""
          >
            <template slot-scope="{ result: { loading, error, data } }">
              <v-expansion-panel>
                <v-expansion-panel-header>
                  {{ tag }}
                  <template v-if="data"> &nbsp;[{{ data.searchPhotos.total }}] </template>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-container grid-list-xs fluid pa-0>
                    <!-- Loading -->
                    <div
                      v-if="loading && data === undefined"
                      v-t="'loading'"
                      class="loading apollo"
                    />

                    <!-- Error -->
                    <div v-else-if="error" v-t="'GroupTag.error'" class="error apollo" />

                    <!-- Result -->
                    <v-layout v-else-if="data && data.searchPhotos.photos.length" row wrap>
                      <v-flex
                        v-for="{ photoId, secret, farm, server } in data.searchPhotos.photos"
                        :key="secret"
                        xs2
                      >
                        <v-card text tile>
                          <group-tag-dialog-image
                            :photo-id="photoId"
                            :secret="secret"
                            :farm="farm"
                            :server="server"
                          />
                        </v-card>
                      </v-flex>
                      <v-flex v-if="data.searchPhotos.total > 18" class="text-center xs12">
                        <v-pagination
                          v-model="page"
                          :length="Math.ceil(data.searchPhotos.total / perPage)"
                          total-visible="6"
                        />
                      </v-flex>
                    </v-layout>

                    <!-- No result -->
                    <div
                      v-else
                      v-t="{ path: 'GroupTag.no_photos_found', args: { tag } }"
                      class="no-result apollo"
                    />
                  </v-container>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </template>
          </ApolloQuery>
        </v-expansion-panels>
      </v-card-text>
      <v-divider />

      <v-card-actions>
        <v-spacer />
        <v-btn v-t="'btn.cancel'" color="primary" text @click="$emit('close')" />
        <ApolloMutation
          :mutation="require('@/graphql/mutations/updateGroupTagsList.gql')"
          :variables="{
            groupId: groupId,
            tags: comboTags,
            preventTrigger,
            useAnd
          }"
          tag=""
          @done="$emit('close')"
        >
          <template slot-scope="{ mutate, loading, error }">
            <p v-if="error" v-t="'GroupTag.error_saving_tag'" />
            <v-btn
              v-else
              ref="saveBtn"
              v-t="'btn.save'"
              :disabled="!canSave || loading"
              :loading="loading"
              color="primary"
              @click="mutate()"
            />
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
      groupTag: {
        type: Object,
        default: function() {
          return { tags: [], preventTrigger: true, useAnd: false }
        }
      },
      group: {
        type: Object,
        required: true
      },
      manageTags: {
        type: Boolean,
        required: true
      }
    },
    data: () => ({
      comboTagsReal: [],
      openedPanel: null,
      perPage: 18,
      page: 1,
      suggestedTags: []
    }),
    computed: {
      groupId() {
        return this.group.groupId
      },
      title() {
        return this.group.title
      },
      tags() {
        return this.groupTag.tags
      },
      hint() {
        return this.preventTrigger
          ? this.$i18n.t('GroupTag.only_new_photos_hint1', {
              comboTags: this.comboTags
            })
          : this.$i18n.t('GroupTag.only_new_photos_hint2', {
              comboTags: this.comboTags
            })
      },
      preventTrigger: {
        set(value) {
          this.groupTag.preventTrigger = value
        },
        get() {
          return this.groupTag.preventTrigger !== null ? this.groupTag.preventTrigger : true
        }
      },
      useAnd: {
        set(value) {
          this.groupTag.useAnd = value
        },
        get() {
          return this.groupTag.useAnd !== null ? this.groupTag.useAnd : false
        }
      },
      useAndHint() {
        return this.groupTag.useAnd
          ? this.$i18n.t('GroupTag.use_and_hint1')
          : this.$i18n.t('GroupTag.use_and_hint2')
      },
      tagsForSearch() {
        return this.useAnd && this.comboTags.length ? [this.comboTags.join(', ')] : this.comboTags
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
