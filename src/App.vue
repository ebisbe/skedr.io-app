<template>
  <v-app
    v-resize="resize"
    :class="{'background': notLogged}"
    light>

    <q-message/>

    <router-view name="toolbar"/>
    <transition name="component-fade" mode="out-in">
      <router-view/>
    </transition>
    <router-view name="rightBar"/>

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
      return this.$route.name === 'Login' || this.$route.name === 'Signup'
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
.q-checkCircle {
  position: absolute;
  top: 8px;
  left: 8px;
}

.q-photo {
  padding: 0;
  transition: padding 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.q-photo:hover {
  cursor: pointer;
}
.q-photo .container {
  position: absolute;
  bottom: 0;
  left: 0;
  padding: inherit;
}
.q-photo .container .v-list {
  padding: 0;
  border-bottom-left-radius: 2px;
  border-bottom-right-radius: 2px;
  background-color: rgba(66, 66, 66, 0.5) !important;
}
.q-photo .container .v-list .white--text {
  text-decoration: none;
}
.q-photo .v-card__media {
  border-bottom-left-radius: 2px;
  border-bottom-right-radius: 2px;
  transition: height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.solid_hr_line {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}
</style>
