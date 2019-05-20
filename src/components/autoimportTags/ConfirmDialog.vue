<template>
  <v-dialog
    v-model="modal"
    lazy
    width="500"
    scrollable
  >
    <v-btn
      slot="activator"
      :disabled="loading"
      :loading="loading"
      ripple
      color="grey lighten-3"
      icon>
      <v-tooltip top lazy>
        <v-icon
          slot="activator"
          color="accent">create_new_folder</v-icon>
        <span>Join Flickr group</span>
      </v-tooltip>
    </v-btn>
    <v-card>
      <v-toolbar dark color="primary">
        <v-toolbar-title>
          Accept group rules ?
        </v-toolbar-title>
        <v-spacer/>
      </v-toolbar>
      <v-card-text style="white-space: pre-line;" v-html="rules"/>
      <v-divider/>

      <v-card-actions>
        <v-spacer/>
        <v-btn
          color="primary"
          flat
          @click="modal = false"
        >
          do not accept
        </v-btn>
        <v-btn
          color="primary"
          @click="() => {
            modal = false
            $emit('mutate')
          }"
        >
          accept
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: {
    rules: {
      type: String,
      required: true
    },
    loading: {
      type: Boolean,
      required: true
    }
  },
  data: () => ({ modal: false })
}
</script>
