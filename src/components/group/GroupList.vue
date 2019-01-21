<template>
  <div>
    <v-divider v-if="useDivider" />
    <v-list-tile
      :key="group.groupId"
      avatar
    >
      <v-list-tile-avatar>
        <a
          :href="`https://www.flickr.com/groups/${group.groupId}`"
          target="_blank"
        >
          <img
            :src="group.icon"
            :alt="group.title"
          >
        </a>
      </v-list-tile-avatar>
      <v-list-tile-content>
        <v-list-tile-title>
          <span>
            <v-tooltip
              v-if="group.photoLimitOptOut"
              top
              lazy
            >
              <v-icon
                slot="activator"
                color="green"
              >check</v-icon>
              <span>This group doesn't care how many other groups a photo is in</span>
            </v-tooltip>
            <v-tooltip
              v-else
              top
              lazy
            >
              <v-icon
                slot="activator"
                color="red"
              >clear</v-icon>
              <span>This group will count toward the photo's limit
                <br>(60 for Pro members, 30 for free members)
              </span>
            </v-tooltip>
          </span>
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
              ><v-icon
                :color="tagsFilter[tag] ? 'accent' : undefined"
                small
                left
                class="mr-1">label</v-icon>{{ tag }}</v-chip>
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
import { mapState } from 'vuex'

export default {
  components: { GroupTagDialog },
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
    manageTags: false
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
