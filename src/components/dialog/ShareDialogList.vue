<template>
  <v-list-tile
    :class="{ selected }"
    avatar
    @click="selectGroup">
    <v-list-tile-avatar>
      <v-badge
        :color="badgeColor"
        v-model="useBadge"
        overlap>
        <span slot="badge">
          <v-icon color="white">{{ badgeType }}</v-icon>
        </span>
        <img :src="group.icon">
      </v-badge>
    </v-list-tile-avatar>
    <v-list-tile-content>
      <v-list-tile-title >
        <photo-limit-opt-out-message v-if="group.photoLimitOptOut !== undefined" :opt-out="group.photoLimitOptOut"/>
        <strong v-html="group.title"/>
        &nbsp;
        <a
          :href="`https://www.flickr.com/groups/${group.id}`"
          target="_blank"
          style="text-decoration:none;"
          @click.stop>
          <v-icon small>open_in_new</v-icon>
        </a>
      </v-list-tile-title>
      <v-list-tile-sub-title>
        <!-- <v-layout
          v-if="group.alreadyInGroup===true"
          row
          wrap>
          Photo already in this group
        </v-layout> -->
        <v-layout
          row
          wrap>
          <v-flex
            class="text-xs-left"
            xs4
          >
            <v-icon>photo</v-icon>
            {{ group.poolCount | parseNumber }}
          </v-flex>
          <v-flex
            class="text-xs-left"
            xs4
          >
            <v-icon>group</v-icon>
            {{ group.members | parseNumber }}
          </v-flex>
          <v-flex
            class="text-xs-left pt-1"
            xs4
            v-html="throttleText(group)"
          />
        </v-layout>
      </v-list-tile-sub-title>
    </v-list-tile-content>
    <v-list-tile-action v-if="allowRemoveAction">
      <v-btn
        icon
        ripple
        @click.stop="$emit('remove')">
        <v-tooltip left>
          <v-icon slot="activator" color="grey lighten-1">clear</v-icon>
          <span>Remove from list</span>
        </v-tooltip>
      </v-btn>
    </v-list-tile-action>
  </v-list-tile>
</template>

<script>
import { throttleText, filters } from '@/mixins/'
import PhotoLimitOptOutMessage from '@/components/group/PhotoLimitOptOutMessage'

export default {
  components: { PhotoLimitOptOutMessage },
  mixins: [throttleText, filters],
  props: {
    group: {
      type: Object,
      required: true
    },
    selected: {
      type: Boolean,
      default: false
    },
    allowRemoveAction: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    disabled() {
      return this.group.throttleMode === 'disabled'
    },
    badgeColor() {
      return this.selected ? 'success' : 'grey'
    },
    badgeType() {
      return this.group.throttleMode === 'disabled' ? 'clear' : 'check'
    },
    useBadge() {
      return this.selected || this.disabled
    }
  },
  methods: {
    selectGroup() {
      if (this.disabled) return
      return this.selected ? this.$emit('remove') : this.$emit('select')
    }
  }
}
</script>
<style lang="css">
.selected {
  background: #f5f5f5;
}
</style>
