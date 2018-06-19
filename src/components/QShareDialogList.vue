<template>
  <v-list-tile
    :class="{selected: group.selected}"
    avatar
    @click="select()">
    <v-list-tile-avatar>
      <v-badge
        :color="badgeColor"
        v-model="badge"
        overlap>
        <span slot="badge">
          <v-icon color="white">{{ badgeType }}</v-icon>
        </span>
        <img :src="group.icon">
      </v-badge>
    </v-list-tile-avatar>
    <v-list-tile-content class="solid_hr_line">
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
export default {
  name: 'QShareDialogList',
  props: {
    group: {
      type: Object,
      required: true
    }
  },
  computed: {
    throttleText() {
      if (this.group.throttleRemaining === undefined) {
        return '∞'
      }
      if (this.group.throttleCount === 0) {
        return '&mdash;'
      }
      return this.group.throttleRemaining + '/' + this.group.throttleCount
    },
    disabled() {
      return this.group.throttleMode === 'disabled' || this.group.alreadyInGroup === true
    },
    badgeColor() {
      if (this.group.selected) {
        return 'success'
      } else {
        return 'grey'
      }
    },
    badgeType() {
      return this.group.throttleMode === 'disabled' ? 'clear' : 'check'
    },
    badge() {
      return this.group.selected || this.disabled
    }
  },
  methods: {
    select() {
      if (!this.disabled) {
        this.group.selected = !this.group.selected
      }
    }
  }
}
</script>
