<template>
  <span v-if="!optOut">
    <v-tooltip right lazy >
      <v-icon slot="activator" color="red" >error_outline</v-icon>
      <span>This group will count toward the photo's limit
        <br>(60 for Pro members, 30 for free members).
        <br>Ask the administrator to change this setting.
      </span>
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
