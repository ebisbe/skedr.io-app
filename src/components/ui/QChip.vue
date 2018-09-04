<template>
  <v-chip
    :color="color"
    :selected="tag.selected"
    @click.native="select">
    <v-avatar :class="[ color, 'darken-2' ]" v-html="percentageText"/>
    {{ tag.name }}
  </v-chip>
</template>

<script>
import Tag from '@/classes/Tag'

export default {
  name: 'QChip',
  props: {
    tag: {
      type: Tag,
      required: true
    }
  },
  computed: {
    color() {
      switch (true) {
        case this.tag.percentage() > 75:
          return 'green'
        case this.tag.percentage() > 49:
          return 'light-green'
        default:
          return undefined
      }
    },
    percentageText() {
      return `${this.tag.percentage()}%`
    }
  },
  methods: {
    select() {
      this.tag.selected = !this.tag.selected
      this.$emit('selectedTag', this.tag.name)
    }
  }
}
</script>
