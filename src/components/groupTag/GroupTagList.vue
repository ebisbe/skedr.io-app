<template>
  <div
    @mouseover="hover = true"
    @mouseleave="hover = false">
    <v-divider v-if="useDivider" />
    <v-list-tile
      :key="group.id"
      avatar
      @click.stop>
      <v-list-tile-avatar>
        <external-link-badge
          :hover="hover"
          :href="`https://www.flickr.com/groups/${group.id}`">
          <img :src="group.icon">
        </external-link-badge>
      </v-list-tile-avatar>
      <v-list-tile-content>
        <v-list-tile-title>
          <photo-limit-opt-out-message :opt-out="group.photoLimitOptOut"/>
          <strong v-html="group.title" />
        </v-list-tile-title>
        <v-list-tile-sub-title>
          <v-layout row wrap>
            <v-flex
              class="text-xs-left"
              xs4
              sm2
            >
              <v-icon>photo</v-icon>
              {{ group.poolCount | parseNumber }}
            </v-flex>
            <v-flex
              class="text-xs-left"
              xs4
              sm2
            >
              <v-icon>group</v-icon>
              {{ group.members | parseNumber }}
            </v-flex>
            <v-flex
              class="text-xs-left pt-1"
              xs4
              sm2
              v-html="throttleText(group)"
            />
            <v-flex
              v-if="tags.length"
              xs12
              sm6
              class="text-xs-right">
              <v-chip
                v-for="tag in tags"
                :key="tag"
                :selected="tagsFilter[tag]"
                small
                label
                @click="$store.commit('tagsFilter/upsert', tag)"
              >
                <v-icon
                  :color="tagsFilter[tag] ? 'accent' : undefined"
                  small
                  left
                  class="mr-1">label</v-icon>
                {{ tag }}
              </v-chip>
            </v-flex>
            <v-flex v-else-if="group.isMember">
              <v-menu
                v-model="suggestedTagsMenu"
                bottom
                offset-y
                max-height="300"
                max-width="285"
                lazy>
                <template v-slot:activator="data">
                  <v-btn
                    v-show="hover || suggestedTagsMenu"
                    :loading="$apolloData.queries.suggestedTags.loading"
                    flat
                    small
                    class="ma-0"
                    @click="getSuggestTagsData"
                  ><v-icon>highlight</v-icon>&nbsp;suggest tags</v-btn>
                </template>
                <div>
                  <v-list v-if="suggestedTags && suggestedTags.length">
                    <ApolloMutation
                      v-for="tag in suggestedTags"
                      :key="tag.name"
                      :mutation="require('@/graphql/mutations/updateGroupTagsList.gql')"
                      :variables="{
                        groupId: group.id,
                        tags: [tag.name],
                        preventTrigger: true
                      }"
                      tag=""
                      @done="$emit('close')"
                    >
                      <template slot-scope="{ mutate, loading, error }">
                        <v-list-tile v-if="error">
                          <v-list-tile-title>Error saving the tag</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile
                          v-else
                          @click="mutate()">
                          <v-list-tile-avatar><v-icon>label</v-icon></v-list-tile-avatar>
                          <v-list-tile-title>{{ tag.name }}</v-list-tile-title>
                          <v-list-tile-action>
                            <v-list-tile-action-text>
                              {{ parseInt(tag.count / tag.total * 100) }}%
                            </v-list-tile-action-text>
                            <v-list-tile-action-text>
                              {{ tag.count }} / {{ tag.total }}
                            </v-list-tile-action-text>
                          </v-list-tile-action>
                        </v-list-tile>
                        <!-- <v-btn
                          ref="saveBtn"
                          :disabled="!canSave || loading"
                          :loading="loading"
                          color="primary"
                          @click="mutate()"
                        >
                          save
                        </v-btn>
                        <p v-if="error">Error adding the tag</p>-->
                      </template>
                    </ApolloMutation>
                  </v-list>
                  <v-list v-else>
                    <v-list-tile>
                      <v-list-tile-content>
                        <v-list-tile-title>
                          Not enought data
                        </v-list-tile-title>
                        <v-list-tile-sub-title>
                          Add more tags to photos from this group
                        </v-list-tile-sub-title>
                      </v-list-tile-content>
                    </v-list-tile>
                  </v-list>
                </div>
              </v-menu>
            </v-flex>
          </v-layout>
        </v-list-tile-sub-title>
      </v-list-tile-content>
      <v-list-tile-action>
        <slot name="action">
          <v-btn
            ripple
            icon
          >
            <v-tooltip
              left
              lazy
            >
              <v-icon
                slot="activator"
                @click="manageTags = true"
              >settings</v-icon>
              <span>Manage tags</span>
            </v-tooltip>
          </v-btn>
        </slot>
      </v-list-tile-action>
      <group-tag-dialog
        :title="group.title"
        :manage-tags="manageTags"
        :group-id="group.id"
        :tags="tags"
        @close="manageTags = false"/>
    </v-list-tile>
  </div>
</template>
<script>
import { throttleText, filters } from '@/mixins'
import GroupTagDialog from '@/components/groupTag/GroupTagDialog'
import PhotoLimitOptOutMessage from '@/components/groupTag/PhotoLimitOptOutMessage'
import ExternalLinkBadge from '@/components/common/ExternalLinkBadge'
import { mapState } from 'vuex'
import { clearTimeout } from 'timers'

export default {
  components: { GroupTagDialog, PhotoLimitOptOutMessage, ExternalLinkBadge },
  mixins: [throttleText, filters],
  props: {
    group: {
      type: Object,
      required: true
    },
    tags: {
      type: Array,
      default: () => []
    },
    useDivider: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    manageTags: false,
    suggestTags: false,
    suggestedTags: undefined,
    suggestedTagsMenu: false,
    hover: false
  }),
  computed: {
    ...mapState('tagsFilter', {
      tagsFilter: state => state.items
    })
  },
  apollo: {
    suggestedTags: {
      query: require('@/graphql/suggestedTags.gql'),
      variables() {
        return {
          groupId: this.group.id
        }
      },
      skip() {
        return !this.suggestTags
      }
    }
  },
  watch: {
    tags() {
      this.manageTags = false
    },
    suggestedTags() {
      this.suggestedTagsMenu = true
    }
  },
  methods: {
    getSuggestTagsData() {
      if (!this.suggestedTags) this.suggestTags = true
      else this.suggestedTagsMenu = true
    }
  }
}
</script>
