<template>
  <v-text-field
    solo
    class="mx-auto"
    prepend-icon="search"
    :placeholder="placeholder"
    style="max-width: 500px; min-width: 128px"
    v-model="search"
    :solo-inverted="soloInverted"
    @keyup.exact.esc="clear"
    @keyup.ctrl.enter="$emit('ctrlEnter')"
    @keyup.exact.ctrl.esc="$emit('ctrlEsc')"
    :append-icon="search === '' ? '' : 'clear'"
    :append-icon-cb="() => (search = '')"
  />
</template>
<script>
export default {
  name: 'QFilter',
  props: {
    placeholder: {
      type: String,
      default: 'Search'
    },
    soloInverted: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      search: '',
      searches: []
    }
  },
  watch: {
    search() {
      this.$emit('search', this.search)
    }
  },
  methods: {
    clear() {
      this.search = ''
    }
  }
}
</script>
