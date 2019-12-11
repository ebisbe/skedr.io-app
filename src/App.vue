<template>
  <v-app v-resize="resize" :class="{ background: notLogged }">
    <q-message multi-line bottom />

    <router-view name="leftDrawer" />
    <router-view name="toolbar" />
    <transition name="component-fade" mode="out-in">
      <router-view />
    </transition>
    <router-view name="rightBar" />
  </v-app>
</template>

<script>
  import { mapActions } from 'vuex'
  import QMessage from '@/components/QMessage'

  export default {
    name: 'App',
    components: { QMessage },
    data() {
      return {
        transitionName: ''
      }
    },
    computed: {
      notLogged() {
        return (
          ['Login', 'Signup', 'ResetPassword', 'ConfirmAccount'].filter(
            routeName => this.$route.name === routeName
          ).length > 0
        )
      }
    },
    watch: {
      $route(to, from) {
        const toDepth = to.path.split('/').length
        const fromDepth = from.path.split('/').length
        this.transitionName = toDepth < fromDepth ? 'slide-x-transition' : 'slide-x-transition'
      }
    },
    mounted() {
      this.onResize({ width: window.innerWidth, height: window.innerHeight })
    },
    methods: {
      resize() {
        this.onResize({ width: window.innerWidth, height: window.innerHeight })
      },
      ...mapActions({
        onResize: 'windowSize'
      })
    }
  }
</script>
<style lang="css">
  .background {
    background-image: url(/img/login-blur-min.jpg) !important;
    background-size: cover !important;
  }

  .component-fade-enter-active,
  .component-fade-leave-active {
    transition: opacity 0.3s ease;
  }
  .component-fade-enter, .component-fade-leave-to
/* .component-fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }

  .topFloat {
    position: absolute !important;
    top: 0;
    left: 0;
  }
  .fullWidth {
    width: 100%;
    width: -moz-available; /* WebKit-based browsers will ignore this. */
    width: -webkit-fill-available; /* Mozilla-based browsers will ignore this. */
    width: stretch;
  }

  .solid_hr_line {
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
</style>
