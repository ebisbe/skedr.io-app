<template>
  <v-text-field
    v-model="search"
    :placeholder="placeholder"
    solo-inverted
    clearable
    solo
    class="mx-auto data-hj-whitelist"
    prepend-icon="search"
    style="max-width: 500px; min-width: 128px"
    @click:append="clearText"
    @keyup.exact.esc="clearText"
    @keyup.ctrl.enter="ctrlEnter"
    @keyup.exact.ctrl.esc="ctrlEsc"
  />
</template>
<script>
export default {
  name: 'QFilter',
  props: {
    placeholder: {
      type: String,
      default: 'Search'
    }
  },
  data() {
    return {
      search: '',
      searches: []
    }
  },
  computed: {
    icon() {
      return this.search.length === 0 ? '' : 'clear'
    }
  },
  watch: {
    search(value) {
      value = value === null ? '' : value
      this.$emit('search', value)
    }
  },
  mounted() {
    this.search = ''
  },
  methods: {
    clearText() {
      this.search = ''
    },
    ctrlEnter() {
      this.$emit('ctrlEnter')
    },
    ctrlEsc() {
      this.$emit('ctrlEsc')
    }
  }
}
</script>
