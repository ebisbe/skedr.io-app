<template>
  <v-flex xs3>
    <v-select
      v-model="locale"
      :items="items"
      :hide-details="true"
      class="pt-0 mt-0"
    />
  </v-flex>
</template>

<script>
export default {
  data: () => ({
    items: [{ text: 'English', value: 'en' }, { text: 'Français', value: 'fr' }, { text: 'Español', value: 'es' }]
  }),
  computed: {
    locale: {
      set(value) {
        this.$i18n.locale = value
        localStorage.setItem('defaultLocale', value)
      },
      get() {
        return this.$i18n.locale
      }
    }
  }
}
</script>
