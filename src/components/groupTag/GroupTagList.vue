<template>
  <div @mouseover="hover = true" @mouseleave="hover = false">
    <v-divider v-if="useDivider" />
    <v-list-item :key="group.id" :ripple="false" link>
      <v-list-item-avatar>
        <external-link-badge :hover="hover" :href="`https://www.flickr.com/groups/${group.id}`">
          <img :src="group.icon" />
        </external-link-badge>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title>
          <photo-limit-opt-out-message :opt-out="group.photoLimitOptOut" />
          <strong>{{ group.title }}</strong>
        </v-list-item-title>
        <v-list-item-subtitle>
          <v-layout wrap>
            <v-flex class="text-left" xs4 sm2>
              <v-icon>photo</v-icon>
              {{ group.poolCount | parseNumber }}
            </v-flex>
            <v-flex class="text-left" xs4 sm2>
              <v-icon>group</v-icon>
              {{ group.members | parseNumber }}
            </v-flex>
            <v-flex class="text-left pt-1" xs4 sm2 v-html="throttleText(group)" />
            <v-flex v-if="tags.length" xs12 sm6 class="text-right">
              <v-chip
                v-for="tag in tags"
                :key="tag"
                :input-value="tagsFilter[tag]"
                small
                label
                class="mx-1"
                @click="$store.commit('tagsFilter/upsert', tag)"
              >
                <v-icon :color="tagsFilter[tag] ? 'accent' : undefined" small left class="mr-1">
                  label
                </v-icon>
                {{ tag }}
              </v-chip>
            </v-flex>
            <v-flex v-else-if="group.isMember">
              <v-menu v-model="suggestedTagsMenu" bottom offset-y max-height="300" max-width="285">
                <template v-slot:activator="data">
                  <v-btn
                    v-show="hover || suggestedTagsMenu"
                    :loading="$apolloData.queries.suggestedTags.loading"
                    text
                    x-small
                    outlined
                    @click.stop="getSuggestTagsData"
                  >
                    {{ $t('GroupTag.suggest_tags') }}
                  </v-btn>
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
                        <v-list-item v-if="error">
                          <v-list-item-title v-t="'GroupTag.error_saving_tag'" />
                        </v-list-item>
                        <v-list-item v-else @click="mutate()">
                          <v-list-item-avatar><v-icon>label</v-icon></v-list-item-avatar>
                          <v-list-item-title>{{ tag.name }}</v-list-item-title>
                          <v-list-item-action>
                            <v-list-item-action-text>
                              {{ parseInt((tag.count / tag.total) * 100) }}%
                            </v-list-item-action-text>
                            <v-list-item-action-text>
                              {{ tag.count }} / {{ tag.total }}
                            </v-list-item-action-text>
                          </v-list-item-action>
                        </v-list-item>
                      </template>
                    </ApolloMutation>
                  </v-list>
                  <v-list v-else>
                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title v-t="'GroupTag.not_enought_data'" />
                        <v-list-item-subtitle v-t="'GroupTag.not_enought_data_suggestion'" />
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </div>
              </v-menu>
            </v-flex>
          </v-layout>
        </v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-action>
        <slot name="action">
          <v-tooltip left>
            <template v-slot:activator="{ on }">
              <v-btn ripple icon small v-on="on">
                <v-icon @click="manageTags = true">
                  settings
                </v-icon>
              </v-btn>
            </template>
            <span v-t="'GroupTag.title'" />
          </v-tooltip>
        </slot>
      </v-list-item-action>
      <group-tag-dialog
        :title="group.title"
        :manage-tags="manageTags"
        :group-id="group.id"
        :tags="tags"
        @close="manageTags = false"
      />
    </v-list-item>
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

<style>
  .v-list-item--link {
    cursor: default !important;
  }
</style>
