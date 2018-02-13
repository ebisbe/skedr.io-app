<template>
  <v-list-tile
    avatar
    @click="select"
    :class="{selected: tag.selected}">
    <v-list-tile-action>
      <v-checkbox
        @click.prevent
        v-model="tag.selected"
        hide-details
      />
    </v-list-tile-action>
    <v-list-tile-content v-html="tag.value" style="border-bottom: 1px solid rgba(0,0,0,.12);"/>
    <v-list-tile-action style="border-bottom: 1px solid rgba(0,0,0,.12);">
      <v-list-tile-action-text>{{ tag.percentage() }}%</v-list-tile-action-text>
      <v-icon color="yellow darken-2" v-html="icon"/>
    </v-list-tile-action>
  </v-list-tile>
</template>
<script>
export default {
  name: 'QTagsDialogList',
  props: {
    tag: {
      type: Object,
      required: true
    }
  },
  computed: {
    icon() {
      switch (true) {
        case this.tag.percentage() >= 85:
          return 'star'
          break
        case this.tag.percentage() >= 50:
          return 'star_half'
          break
        default:
          return 'star_border'
      }
    }
  },
  methods: {
    select() {
      this.tag.selected = !this.tag.selected
    }
  }
}
</script>
