<template>
  <v-container fill-height>
    <v-layout align-center>
      <v-flex v-if="!loading || error" xs12>
        <div class="text-center">
          <v-icon size="120" class="text-center">
            {{ icon }}
          </v-icon>
        </div>
        <h1 class="text-center headline" v-html="desc" />
      </v-flex>
      <v-flex v-else xs12>
        <div class="text-center">
          <v-progress-circular size="50" indeterminate color="accent" />
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import * as Sentry from '@sentry/vue'

  export default {
    name: 'Empty',
    props: {
      icon: {
        type: String,
        default: ''
      },
      description: {
        type: [String, Object],
        default: ''
      },
      loading: {
        type: Boolean,
        default: false
      },
      error: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      desc() {
        if (this.error) {
          Sentry.captureException(this.description.graphQLErrors)
          return 'Oops! Some error happened fetching your data...'
        } else {
          return this.description
        }
      }
    }
  }
</script>
