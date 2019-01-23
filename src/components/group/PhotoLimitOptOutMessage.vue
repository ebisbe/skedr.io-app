<template>
  <span>
    <v-tooltip
      v-if="optOut"
      top
      lazy
    >
      <v-icon
        slot="activator"
        color="green"
      >check</v-icon>
      <span>This group doesn't care how many other groups a photo is in</span>
    </v-tooltip>
    <v-tooltip
      v-else
      top
      lazy
    >
      <v-icon
        slot="activator"
        color="red"
      >clear</v-icon>
      <span>This group will count toward the photo's limit
        <br>(60 for Pro members, 30 for free members)
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
