<template>
  <v-text-field
    ref="input"
    v-model="search"
    :placeholder="placeholder"
    v-bind="$listeners"
    solo-inverted
    clearable
    solo
    class="mx-auto data-hj-whitelist"
    style="max-width: 500px; min-width: 128px"
    prepend-inner-icon="search"
    @click:append="clearText"
    @keyup.exact.esc="clearText"
    @keyup.enter="enter"
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
    },
    dontFocus: {
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
  computed: {
    icon() {
      return this.search.length === 0 ? 'search' : 'clear'
    }
  },
  watch: {
    search(value) {
      if (value === null) {
        this.$emit('clear')
      }
      value = value === null ? '' : value
      this.$emit('search', value)
    }
  },
  mounted() {
    if (!this.dontFocus) {
      this.$refs.input.focus()
    }
    this.search = ''
  },
  methods: {
    clearText() {
      this.search = ''
      this.$emit('clear')
    },
    enter() {
      this.$emit('enter', this.search)
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
