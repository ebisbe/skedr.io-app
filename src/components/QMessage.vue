<template>
  <v-snackbar
    v-model="active"
    :timeout="4000"
    v-bind="$attrs">
    {{ message }}
    <v-btn
      dark
      color="accent"
      flat
      @click="active = false"
    >
      Close
    </v-btn>
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
