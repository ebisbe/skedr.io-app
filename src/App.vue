<template>
    <div>
        <nav-bar></nav-bar>
        <router-view></router-view>
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