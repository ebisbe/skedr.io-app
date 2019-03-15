<template>
  <div
    @mouseover="hover = true"
    @mouseleave="hover = false">
    <v-divider v-if="useDivider" />
    <v-list-tile
      :key="group.groupId"
      avatar
      @click.stop>
      <v-list-tile-avatar>
        <v-badge
          v-model="hover"
          class="external-link"
          color="grey"
          overlap>
          <a
            slot="badge"
            :href="`https://www.flickr.com/groups/${group.groupId}`"
            style="text-decoration: none;"
            target="_blank">
            <v-icon color="white">open_in_new</v-icon>
          </a>
          <img :src="group.icon">
        </v-badge>
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
            color="grey lighten-3"
            icon
          >
            <v-tooltip
              top
              lazy
            >
              <v-icon
                slot="activator"
                color="primary"
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
        :group-id="group.groupId"
        :tags="tags"
        @close="manageTags = false"/>
    </v-list-tile>
  </div>
</template>
<script>
import { throttleText, filters } from '@/mixins'
import GroupTagDialog from '@/components/group/GroupTagDialog'
import PhotoLimitOptOutMessage from '@/components/group/PhotoLimitOptOutMessage'
import { mapState } from 'vuex'
import { clearTimeout } from 'timers'

export default {
  components: { GroupTagDialog, PhotoLimitOptOutMessage },
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
