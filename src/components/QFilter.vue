<template>
  <v-text-field
    v-model="search"
    :placeholder="placeholder"
    :solo-inverted="soloInverted"
    :append-icon="search === '' ? '' : 'clear'"
    :append-icon-cb="() => (search = '')"
    solo
    class="mx-auto"
    prepend-icon="search"
    style="max-width: 500px; min-width: 128px"
    @keyup.exact.esc="clear"
    @keyup.ctrl.enter="$emit('ctrlEnter')"
    @keyup.exact.ctrl.esc="$emit('ctrlEsc')"
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
