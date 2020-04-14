<template>
  <v-list-item
    :class="{ selected, alreadyInGroup, disabled }"
    @mouseover="hover = true"
    @mouseleave="hover = false"
    v-on="clickable ? { click: selectGroup } : { click: () => ({}) }"
  >
    <v-list-item-avatar>
      <img :src="group.icon" />
    </v-list-item-avatar>
    <v-list-item-content>
      <v-list-item-title>
        <photo-limit-opt-out-message
          v-if="group.photoLimitOptOut !== undefined"
          :opt-out="group.photoLimitOptOut"
        />
        <strong>{{ group.title }}</strong>
      </v-list-item-title>
      <v-list-item-subtitle>
        <v-layout v-if="alreadyInGroup" v-t="'ShareDialog.already_in_group'" />
        <v-layout v-else>
          <v-flex class="text-left" xs4>
            <v-icon>photo</v-icon>
            {{ group.poolCount | parseNumber }}
          </v-flex>
          <v-flex class="text-left" xs4>
            <v-icon>group</v-icon>
            {{ group.members | parseNumber }}
          </v-flex>
          <v-flex class="text-left pt-1" xs4 v-html="throttleText(group)" />
        </v-layout>
      </v-list-item-subtitle>
    </v-list-item-content>
    <v-list-item-action v-if="allowRemoveAction || (selected && hover)">
      <v-btn fab x-small depressed ripple @click.stop="$emit('remove')">
        <v-tooltip left>
          <template v-slot:activator="{ on }">
            <v-icon color="grey lighten-1" v-on="on">
              clear
            </v-icon>
          </template>
          <span v-t="'ShareDialog.remove'" />
        </v-tooltip>
      </v-btn>
    </v-list-item-action>
    <v-list-item-action v-else-if="useBadge">
      <v-btn :color="badgeColor" x-small depressed fab>
        <v-icon color="white">
          {{ badgeType }}
        </v-icon>
      </v-btn>
    </v-list-item-action>
  </v-list-item>
</template>

<script>
  import { throttleText, filters } from '@/mixins/'
  import PhotoLimitOptOutMessage from '@/components/groupTag/PhotoLimitOptOutMessage'

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
