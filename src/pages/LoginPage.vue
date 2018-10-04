<template>
  <v-content>
    <v-container
      :class="{'pa-0': $vuetify.breakpoint.xs}"
      fluid
      fill-height>
      <v-layout justify-center>
        <v-dialog
          v-model="dialog"
          :fullscreen="$vuetify.breakpoint.xs"
          persistent
          hide-overlay
          max-width="500"
          transition="dialog-bottom-transition">
          <v-card class="elevation-12" >

            <router-view :class="{'pa-2': $vuetify.breakpoint.xs, 'pb-3': $vuetify.breakpoint.smAndUp}"/>

          </v-card>
        </v-dialog>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
export default {
  data: () => ({
    dialog: true
  })
}
</script>
