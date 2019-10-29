<template>
  <v-container class="footer">
    <v-list two-line >
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="white--text">
            <slot name="title">
              {{ title }}
            </slot>
          </v-list-item-title>
          <slot name="subtitle">
            <v-list-item-subtitle>
              {{ subtitle }}
            </v-list-item-subtitle>
          </slot>
        </v-list-item-content>
        <slot name="action"/>
      </v-list-item>
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
  border-radius:0px;
  background-color: rgba(66, 66, 66, 0.5) !important;
}
</style>


