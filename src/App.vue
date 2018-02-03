<template>
    <v-app light>

        <router-view name="toolbar"></router-view>
        <router-view></router-view>
        <router-view name="rightBar"></router-view>

        <q-share-dialog :pool="sharePool"></q-share-dialog>
    </v-app>
</template>

<script>
  import { mapState } from 'vuex'
  import QShareDialog from './components/QShareDialog'

  export default {
    name: 'app',
    components: {QShareDialog},
    computed: {
      ...mapState([
        'sharePool'
      ])
    }
  }
</script>
