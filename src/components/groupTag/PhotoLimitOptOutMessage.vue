<template>
  <span v-if="!optOut">
    <v-tooltip right >
      <template v-slot:activator="{ on }">
        <v-icon color="red" v-on="on" >error_outline</v-icon>
      </template>
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
