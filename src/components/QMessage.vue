<template>
  <v-snackbar v-model="active" :timeout="7000" v-bind="$attrs" :multi-line="message.length > 80">
    {{ message }}
  </v-snackbar>
</template>

<script>
  export default {
    name: 'QMessage',
    computed: {
      active: {
        get() {
          return this.$store.state.message.status
        },
        set(newStatus) {
          this.$store.dispatch('message/switchStatus', newStatus)
          this.$nextTick(function() {
            this.$store.dispatch('message/shift')
          })
        }
      },
      message() {
        return this.$store.state.message.value
      }
    }
  }
</script>
