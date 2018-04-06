<template>
  <v-content class="landing">
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
    <full-page
      :options="options"
      @on-leave="onLeave"
      @after-load="afterLoad">
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
          <p class="headline">Discover your free time</p>
        </v-layout>
      </v-container>
      <v-container class="section white pa-0">
        <v-layout
          align-center
          class="info white--text"
          style="height:80%;">
          <v-flex :class="{'hiddenInfo': true, information, 'offset-xs1': information, 'xs5': true}">
            <h2 class="display-3">Make the
              <br>most of
            <br>every day</h2>
            <p class="title">The new Skedr app helps
              <br>you spend less time managing your
            <br>schedule and more time enjoying it.</p>
          </v-flex>
        </v-layout>
      </v-container>
      <v-container class="section pa-0">
        <v-layout
          align-center
          class="backgrounds"
          style="background-image:url(/static/img/dikaseva-35077-unsplash-blur-min.jpg);">
          <v-flex :class="{'hiddenInfo': true, 'white--text':true, information, 'offset-xs1': information}">
            <h2 class="display-3 ">Photos from
              <br>Flickr are added
            <br>to your groups</h2>
            <p class="title">When you upload a
              <br>photo tagged it will be added
            <br>to your selected groups automatically.</p>
          </v-flex>
        </v-layout>
      </v-container>
      <v-container class="section pa-0">
        <v-layout
          align-center
          class="backgrounds"
          style="background-image:url(/static/img/galen-crout-78522-unsplash-blur-min.jpg); ">
          <v-flex :class="{'hiddenInfo': true, 'white--text':true, information, 'offset-xs1': information}">
            <h2 class="display-3 ">Scheduled
            <br>photos</h2>
            <p class="title">Schedule View brings
              <br>your schedule to life
              <br>and makes it easy to
            <br> see what's ahead in time.</p>
          </v-flex>
        </v-layout>
      </v-container>
      <v-container class="section info pa-0 white--text">
        <v-flex class="text-xs-center display-3 pa-5">Enjoy your free time</v-flex>
        <v-layout
          row
          wrap
          class="py-5">
          <v-flex class="xs12 sm6 py-5">
            <v-layout
              align-center
              justify-center
              column
              class="pa-0 pb-5">
              <v-avatar
                color="white"
                size="105px">
                <v-icon x-large>show_chart</v-icon>
              </v-avatar>
              <p class="headline text-xs-center">Sharing photos to more
                <br>groups will make your
              <br>photos more visible at Flickr.</p>
            </v-layout>
          </v-flex>
          <v-flex class="xs12 sm6 py-5">
            <v-layout
              align-center
              justify-center
              column
              class="pa-0 pb-5">
              <v-avatar
                color="white"
                size="105px">
                <v-icon x-large>photo</v-icon>
              </v-avatar>
              <p class="headline text-xs-center">Enjoy your time <br>taking more photos.</p>
            </v-layout>
          </v-flex>
        </v-layout>
        <v-flex class="blue darken-3 pa-5 display-3 text-xs-center ">
          Try Skedr.io
        </v-flex>
      </v-container>
    </full-page>
    <div
      id="device"
      :class="device">
      <div class="device-frame">
        <div class="device-screen">
          <img
            style="position:absolute; z-index:5;"
            class="device-content"
            src="/static/img/View_photostream-min.png">
          <img
            :class="{initShare: true, 'device-content': true, share: share >= 2}"
            src="/static/img/Action_share-min.png">
          <img
            :class="{initShare: true, 'device-content': true, share: share >= 3}"
            src="/static/img/View_scheduled-min.png">
        </div>
      </div>
      <div class="device-stripe"/>
      <div class="device-header"/>
      <div class="device-sensors"/>
      <div class="device-btns"/>
      <div class="device-power"/>
    </div>
  </v-content>
</template>
<script>
import FullPage from 'vue-fullpage.js'

export default {
  name: 'Home',
  components: { FullPage },
  data() {
    return {
      options: {
        scrollingSpeed: 1000,
        css3: true,
        easingcss3: 'cubic-bezier(0.4, 0, 0.2, 1)'
      },
      information: false,
      device: {
        device: true,
        deviceCustom: true,
        'device-google-pixel': true,
        'device-black': true,
        initPosition: false,
        hiddenPosition: false,
        fixed: false
      },
      share: 0,
      showButton: true
    }
  },
  methods: {
    onLeave(index, nextIndex, direction) {
      if (index === 1 && nextIndex === 2) {
        this.device.initPosition = true
      }
      if (index === 2 && nextIndex === 1) {
        this.device.initPosition = false
        this.device.fixed = false
      }
      if (index === 4 && nextIndex === 5) {
        this.device.hiddenPosition = true
        this.device.fixed = false
        this.showButton = false
      }
      if (index === 5 && nextIndex === 4) {
        this.device.hiddenPosition = false
        this.device.fixed = true
        this.showButton = true
      }
      this.information = false
      if (direction === 'down') {
        this.share++
      } else {
        this.share--
      }
    },
    afterLoad(anchorLink, index) {
      this.information = true
    },
    moveSectionDown() {
      $.fn.fullpage.moveSectionDown()
    }
  }
}
</script>
<style>
.landing .container {
  margin: 0;
  max-width: inherit;
  height: 100%;
}
.backgrounds {
  height: 60%;
  top: 15%;
  position: relative;
  background-size: cover;
  background-position-y: bottom;
}

.section .hiddenInfo {
  opacity: 0;
  transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transition-property: margin opacity;
}
.section .information {
  opacity: 1;
}

.deviceCustom {
  position: absolute !important;
  transition: top 1s cubic-bezier(0.4, 0, 0.2, 1);
}
.device.initPosition {
  top: 15vh;
}
.device.hiddenPosition {
  top: -850px;
}
.device.fixed {
  position: fixed;
}

.device .device-frame .device-screen {
  overflow: hidden;
  position: relative;
  height: 100%;
}
.device .device-frame .device-screen .initShare {
  position: absolute;
  z-index: 6;
  bottom: -100%;
  transition: bottom 1s cubic-bezier(0.4, 0, 0.2, 1);
}
.device .device-frame .device-screen .initShare.share {
  bottom: 0;
}

@media all and (min-width: 0) {
  .mediaColor {
    color: lime;
  }
  .deviceCustom {
    top: 90vh;
    right: -20vw;
  }
}
@media all and (min-width: 600px) {
  .mediaColor {
    color: limegreen;
  }
  .deviceCustom {
    top: 90vh;
    right: -10vw;
  }
}
@media all and (min-width: 960px) {
  .mediaColor {
    color: greenyellow;
  }
  .deviceCustom {
    top: 90vh;
    right: 10vw;
  }
}
@media all and (min-width: 1265px) {
  .mediaColor {
    color: forestgreen;
  }

  .deviceCustom {
    top: 90vh;
    right: 26vw;
  }
}
@media all and (min-width: 1905px) {
  .mediaColor {
    color: green;
  }
}
</style>
