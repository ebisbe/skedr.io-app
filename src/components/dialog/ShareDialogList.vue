<template>
  <v-list-tile
    :class="{ selected, alreadyInGroup, disabled }"
    avatar
    @mouseover="hover = true"
    @mouseleave="hover = false"
    v-on="clickable ? { click: selectGroup } : { click: () => ({})}">
    <v-list-tile-avatar>
      <external-link-badge
        :hover="hover"
        :href="`https://www.flickr.com/groups/${group.id}`">
        <img :src="group.icon">
      </external-link-badge>
    </v-list-tile-avatar>
    <v-list-tile-content>
      <v-list-tile-title >
        <photo-limit-opt-out-message v-if="group.photoLimitOptOut !== undefined" :opt-out="group.photoLimitOptOut"/>
        <strong v-html="group.title"/>
      </v-list-tile-title>
      <v-list-tile-sub-title>
        <v-layout
          v-t="'ShareDialog.already_in_group'"
          v-if="alreadyInGroup"
          row
          wrap/>
        <v-layout
          v-else
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
    <v-list-tile-action v-if="allowRemoveAction || ( selected && hover ) ">
      <v-btn
        icon
        ripple
        @click.stop="$emit('remove')">
        <v-tooltip left>
          <v-icon slot="activator" color="grey lighten-1">clear</v-icon>
          <span v-t="'ShareDialog.remove'"/>
        </v-tooltip>
      </v-btn>
    </v-list-tile-action>
    <v-list-tile-action v-else-if="useBadge">
      <v-btn
        :color="badgeColor"
        icon
        ripple>
        <v-icon color="white">{{ badgeType }}</v-icon>
      </v-btn>
    </v-list-tile-action>
  </v-list-tile>
</template>

<script>
import { throttleText, filters } from '@/mixins/'
import PhotoLimitOptOutMessage from '@/components/groupTag/PhotoLimitOptOutMessage'
import ExternalLinkBadge from '@/components/common/ExternalLinkBadge'

export default {
  components: { PhotoLimitOptOutMessage, ExternalLinkBadge },
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
    },
    alreadyInGroup: {
      type: Boolean,
      default: false
    },
    selectable: {
      type: Boolean,
      default: true
    }
  },
  data: () => ({ hover: false }),
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
      return this.selected || this.disabled || this.alreadyInGroup
    },
    clickable() {
      return !this.disabled && !this.alreadyInGroup && this.selectable
    }
  },
  methods: {
    selectGroup() {
      return this.selected ? this.$emit('remove') : this.$emit('select')
    }
  }
}
</script>
<style lang="css">
.selected {
  background: #eeeeee;
}
.alreadyInGroup {
  background: #f1f8e9;
}
.disabled {
  background: #ffebee;
}
</style>
