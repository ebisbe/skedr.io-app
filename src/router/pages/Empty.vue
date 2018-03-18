<template>
  <v-container fill-height>
    <v-layout align-center>
      <v-flex xs12 v-if="!loading">
        <div class="text-xs-center">
          <v-icon
            size="120px"
            class="text-xs-center"
            v-html="icon"/>
        </div>
        <h1 class="text-xs-center headline" v-html="description"/>
      </v-flex>
      <v-flex v-else xs12>
        <div class="text-xs-center">
          <v-progress-circular
            size="50"
            indeterminate
            color="info"/>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'Empty',
  props: {
    icon: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    loading: {
      type: Boolean,
      default: false
    }
  }
}
</script>
