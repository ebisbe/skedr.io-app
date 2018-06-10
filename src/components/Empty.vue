<template>
  <v-container fill-height>
    <v-layout align-center>
      <v-flex v-if="!loading || error" xs12>
        <div class="text-xs-center">
          <v-icon
            size="120"
            class="text-xs-center"
            v-html="icon"/>
        </div>
        <h1 class="text-xs-center headline" v-html="desc"/>
      </v-flex>
      <v-flex v-else xs12>
        <div class="text-xs-center">
          <v-progress-circular
            size="50"
            indeterminate
            color="accent"/>
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
    },
    error: {
      type: Boolean,
      default: false
    },
    errorText: {
      type: String,
      default: 'Ups! Some error happened fetching your data...'
    }
  },
  computed: {
    desc() {
      if (this.error) {
        return this.errorText
      } else {
        return this.description
      }
    }
  }
}
</script>
