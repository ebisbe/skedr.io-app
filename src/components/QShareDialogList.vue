<template>
  <v-list-tile
    avatar
    @click="select()"
    :class="{selected: group.selected}">
    <v-list-tile-action>
      <v-checkbox
        @click.prevent
        v-model="group.selected"
        hide-details
        :disabled="disabled"
        :indeterminate="disabled"
      />
    </v-list-tile-action>
    <v-list-tile-avatar>
      <img :src="group.icon">
    </v-list-tile-avatar>
    <v-list-tile-content style="border-bottom: 1px solid rgba(0,0,0,.12);">
      <v-list-tile-title v-html="group.title"/>
      <v-list-tile-sub-title>
        <v-layout
          row
          wrap
          v-if="group.alreadyInGroup===true">
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
