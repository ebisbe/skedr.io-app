<template>
  <span v-if="!optOut">
    <v-tooltip right lazy >
      <v-icon slot="activator" color="red" >error_outline</v-icon>
      <span v-t="'GroupTag.photo_limit'"/>
    </v-tooltip>
  </span>
</template>

<script>
export default {
  props: {
    optOut: {
      type: Boolean,
      required: true
    }
  }
}
</script>
