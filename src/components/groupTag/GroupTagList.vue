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
          <v-layout>
            <v-flex
              class="text-xs-left"
              xs2
            >
              <v-icon>photo</v-icon>
              {{ group.poolCount | parseNumber }}
            </v-flex>
            <v-flex
              class="text-xs-left"
              xs2
            >
              <v-icon>group</v-icon>
              {{ group.members | parseNumber }}
            </v-flex>
            <v-flex
              class="text-xs-left pt-1"
              xs2
              v-html="throttleText(group)"
            />
            <v-flex
              v-if="tags.length"
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
          </v-layout>
        </v-list-tile-sub-title>
      </v-list-tile-content>
      <v-list-tile-action>
        <slot name="action">
          <v-menu
            :close-on-content-click="false"
            bottom
            lazy
            left>
            <template v-slot:activator="{ on: mainMenu }">
              <v-btn
                icon
                @click="suggestTags = true"
                v-on="mainMenu"
              >
                <v-icon>more_vert</v-icon>
              </v-btn>
            </template>

            <v-list>
              <v-list-tile
                @click="manageTags = true"
              >
                <v-list-tile-action><v-icon>settings</v-icon></v-list-tile-action>
                <v-list-tile-title>Manage tags</v-list-tile-title>
              </v-list-tile>
              <v-menu
                bottom
                left
                offset-x
                lazy>
                <template v-slot:activator="{ on }">
                  <v-list-tile
                    v-on="on"
                  >
                    <v-list-tile-action><v-icon>highlight</v-icon></v-list-tile-action>
                    <v-list-tile-title>Suggested tags</v-list-tile-title>
                  </v-list-tile>
                </template>
                <v-list style="max-width:285px">
                  <!-- <v-list-tile>Add directly tags from your photos</v-list-tile> -->
                  <v-list-tile
                    v-for="tag in suggestedTags"
                    :key="tag.name">
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
                </v-list>
              </v-menu>
            </v-list>
          </v-menu>
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
          groupId: this.group.groupId
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
    }
  }
}
</script>
