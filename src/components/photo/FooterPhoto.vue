<template>
  <v-container class="footer">
    <v-list two-line dark>
      <v-list-tile>
        <v-list-tile-content>
          <v-list-tile-title >
            <slot name="title">
              {{ title }}
            </slot>
          </v-list-tile-title>
          <slot name="subtitle">
            <v-list-tile-sub-title>
              {{ subtitle }}
            </v-list-tile-sub-title>
          </slot>
        </v-list-tile-content>
        <slot name="action"/>
      </v-list-tile>
    </v-list>
  </v-container>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    subtitle: {
      type: String,
      default: ''
    }
  }
}
</script>
<style scoped>
.footer {
  position: absolute;
  bottom: 0;
  left: 0;
  padding: inherit;
}
.footer .v-list {
  padding: 0;
  border-bottom-left-radius: 2px;
  border-bottom-right-radius: 2px;
  background-color: rgba(66, 66, 66, 0.5) !important;
}
</style>


