
<template>
  <v-chip
    :selected="selected"
    label
    small
  >
    <span class="pr-1">
      {{ tag }}
    </span>
    <span v-if="photoTagsList" class="pr-1">[{{ totalImages }}]</span>
    <v-icon
      small
      @click="$emit('click')"
    >close</v-icon>
  </v-chip>
</template>
<script>
export default {
  props: {
    tag: {
      type: String,
      required: true
    },
    selected: {
      type: Boolean,
      required: true
    },
    photoTagsList: {
      required: true,
      validator: function(value) {
        return Array.isArray(value) || value === null
      }
    }
  },
  computed: {
    totalImages() {
      return this.photoTagsList.filter(query => query.photo.tags.indexOf(this.tag) >= 0).length
    }
  }
}
</script>
