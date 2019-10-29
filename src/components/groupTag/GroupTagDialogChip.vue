
<template>
  <v-chip
    :input-value="inputValue"
    label
    small
  >
    <v-icon
      small
      left
      class="mr-1">label</v-icon>
    <span class="pr-1">
      {{ tag }}
    </span>
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
    inputValue: {
      type: Boolean,
      default: false
    }
  }
}
</script>
