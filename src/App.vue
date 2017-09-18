<template>
    <div>
        <nav-bar></nav-bar>
        <router-view></router-view>
        <notifications
                group="notifications"
                :max="3"
                :duration="5000"
                position="bottom right"
                animation-type="velocity"
                :speed="500"/>
    </div>
</template>

<script>
  import NavBar from './components/NavBar.vue'

  export default {
    name: 'app',
    components: {NavBar}
  }
</script>
<style>
    body {
        padding-top: 3rem;
        padding-bottom: 3rem;
    }
</style>