<template>
  <v-badge
    v-model="hover"
    class="external-link"
    color="grey"
    overlap>
    <a
      slot="badge"
      :href="href"
      style="text-decoration: none;"
      target="_blank">
      <v-icon color="white">open_in_new</v-icon>
    </a>
    <slot />
  </v-badge>
</template>
<script>
export default {
  props: {
    hover: {
      type: Boolean,
      required: true
    },
    href: {
      type: String,
      required: true
    }
  }
}
</script>
<style scoped>
.external-link {
  border-radius: inherit;
}
.external-link:hover {
  cursor: pointer;
}
</style>

