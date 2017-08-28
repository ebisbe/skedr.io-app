<template>
    <div>
        <nav-bar></nav-bar>
        <pool></pool>
        <div class="container">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
  import NavBar from './components/NavBar.vue'
  import Pool from './components/Pool.vue'

  export default {
    name: 'app',
    components: {NavBar, Pool}
  }
</script>
<style>
    body {
        padding-top: 5rem;
    }
</style>
