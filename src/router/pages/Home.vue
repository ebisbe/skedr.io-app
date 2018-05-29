<template>
  <v-content>
    <v-fab-transition>
      <v-btn
        v-show="showButton"
        color="white"
        fab
        fixed
        bottom
        right
        @click.native="moveSectionDown"
      >
        <v-icon x-large>expand_more</v-icon>
      </v-btn>
    </v-fab-transition>
    <v-container class="section info pa-0">
      <v-layout
        align-center
        justify-center
        column
        class="white pa-0 pb-5"
        style="height:80%">
        <img
          height="152"
          src="/static/img/clock.png"
          alt="Skedr.io">
        <h1 xs12 class="display-4 text-xs-center">Skedr.io</h1>
        <h2 class="headline">Autoimport and autoschedule for Flickr Groups</h2>
        <p class="title">Discover your free time</p>
      </v-layout>
    </v-container>
  </v-content>
</template>
<script>
export default {
  name: 'Home'
}
</script>
