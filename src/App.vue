<template>
  <v-app light>

    <router-view name="toolbar"/>
    <router-view/>
    <router-view name="rightBar"/>

    <q-share-dialog :pool="sharePool" :selected-groups="selectedGroups"/>
  </v-app>
</template>

<script>
import { mapState } from 'vuex'
import QShareDialog from './components/QShareDialog'

export default {
  name: 'App',
  components: { QShareDialog },
  computed: {
    ...mapState(['sharePool', 'selectedGroups'])
  }
}
</script>
