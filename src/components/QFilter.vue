<template>
    <v-text-field
            light
            solo
            prepend-icon="search"
            :placeholder="placeholder"
            style="max-width: 500px; min-width: 128px"
            v-model="search"
            @keyup.esc="clear"
            :append-icon="search === '' ? '' : 'clear'"
            :append-icon-cb="() => (search = '')"
    ></v-text-field>
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
    data () {
      return {
        search: '',
        searches: []
      }
    },
    methods: {
      clear () {
        this.search = ''
      }
    },
    watch: {
      search () {
        this.$emit('search', this.search)
      }
    }
  }
</script>