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
            <v-flex class="text-xs-right">
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
          <v-btn
            ripple
            icon
          >
            <v-tooltip
              top
              lazy
            >
              <v-icon
                slot="activator"
                @click="manageTags = true"
              >more_vert</v-icon>
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
import GroupTagDialog from '@/components/group/GroupTagDialog'
import PhotoLimitOptOutMessage from '@/components/group/PhotoLimitOptOutMessage'
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
    hover: false
  }),
  computed: {
    ...mapState('tagsFilter', {
      tagsFilter: state => state.items
    })
  },
  watch: {
    tags() {
      this.manageTags = false
    }
  }
}
</script>
