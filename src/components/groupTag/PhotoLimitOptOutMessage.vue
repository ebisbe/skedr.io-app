<template>
  <span v-if="!optOut">
    <v-tooltip right>
      <template v-slot:activator="{ on }">
        <v-icon color="red" v-on="on">error_outline</v-icon>
      </template>
      <span>{{ $t('GroupTag.photo_limit') }}</span>
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
