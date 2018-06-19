<template>
  <v-list-tile
    :class="{selected: tag.selected}"
    avatar
    @click="select">
    <v-list-tile-action>
      <v-checkbox
        v-model="tag.selected"
        hide-details
        @click.prevent
      />
    </v-list-tile-action>
    <v-list-tile-content class="solid_hr_line" v-html="tag.value"/>
    <v-list-tile-action class="solid_hr_line">
      <v-list-tile-action-text>{{ tag.percentage() }}%</v-list-tile-action-text>
      <v-icon color="yellow darken-2" v-html="icon"/>
    </v-list-tile-action>
  </v-list-tile>
</template>
<script>
import Tag from '@/classes/Tag'

export default {
  name: 'QTagsDialogList',
  props: {
    tag: {
      type: Tag,
      required: true
    }
  },
  computed: {
    icon() {
      switch (true) {
        case this.tag.percentage() >= 85:
          return 'star'
        case this.tag.percentage() >= 50:
          return 'star_half'
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
