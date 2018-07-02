<template>
  <v-list-tile
    :class="{selected: group.selected}"
    avatar
    @click="select()">
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
    <v-list-tile-content class="q-solid_hr_line">
      <v-list-tile-title v-html="group.title"/>
      <v-list-tile-sub-title>
        <v-layout
          v-if="group.alreadyInGroup===true"
          row
          wrap>
          Photo already in this group
        </v-layout>
        <v-layout
          v-else
          row
          wrap>
          <span>Members: {{ group.members }}</span>
          <v-spacer/>
          <span>Photos: {{ group.poolCount }}</span>
          <v-spacer/>
          <span v-html="throttleText"/>&nbsp;<span>{{ group.throttleMode }}</span>
        </v-layout>
      </v-list-tile-sub-title>
    </v-list-tile-content>
  </v-list-tile>
</template>

<script>
import Group from '@/classes/Group'
export default {
  name: 'QShareDialogList',
  props: {
    group: {
      type: Group,
      required: true
    }
  },
  computed: {
    throttleText() {
      return this.group.throttleText()
    },
    disabled() {
      return this.group.isDisabled()
    },
    badgeColor() {
      return this.group.selected ? 'success' : 'grey'
    },
    badgeType() {
      return this.group.throttleMode === 'disabled' ? 'clear' : 'check'
    },
    useBadge() {
      return this.group.selected || this.group.isDisabled()
    }
  },
  methods: {
    select() {
      this.group.select()
    }
  }
}
</script>
