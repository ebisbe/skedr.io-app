<template>
    <div class="container">
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
        padding-top: 5rem;
    }
</style>
