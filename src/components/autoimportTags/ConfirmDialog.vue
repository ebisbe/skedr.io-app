<template>
  <v-dialog
    v-model="modal"

    width="500"
    scrollable
  >
    <template v-slot:activator="{ on }">
      <v-btn
        :disabled="loading"
        :loading="loading"
        ripple
        icon
        v-on="on">
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-icon
              slot="activator"
              color="accent">create_new_folder</v-icon>
          </template>
          <span v-t="'AutoimportTags.title'"/>
        </v-tooltip>
      </v-btn>
    </template>
    <v-card>
      <v-toolbar color="primary">
        <v-toolbar-title v-t="$t('AutoimportTags.accept_rules')" class="white--text"/>
        <v-spacer/>
      </v-toolbar>
      <v-card-text class="pt-5 black--text" v-html="rules"/>
      <v-divider/>

      <v-card-actions>
        <v-spacer/>
        <v-btn
          v-t="$t('btn.not_accept')"
          color="primary"
          text
          @click="modal = false"
        />
        <v-btn
          v-t="'btn.accept'"
          color="primary"
          @click="() => {
            modal = false
            $emit('mutate')
          }"
        />
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
