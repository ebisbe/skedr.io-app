<template>
  <v-chip
    :color="color"
    :selected="selected"
    @click.native="select">
    <v-avatar :class="[ color, 'darken-2' ]">{{ tag.percentage() }}%</v-avatar>
    {{ tag.value }}
  </v-chip>
</template>

<script>
export default {
  name: 'QChip',
  props: {
    tag: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      selected: false
    }
  },
  computed: {
    color() {
      switch (true) {
        case this.tag.percentage() > 75:
          return 'green'
          break
        case this.tag.percentage() > 49:
          return 'light-green'
          break
        default:
          return undefined
      }
    }
  },
  methods: {
    select() {
      this.selected != this.selected
      this.$emit('selectedTag', this.tag.value)
    }
  }
}
</script>
