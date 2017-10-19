<template>
    <v-toolbar fixed :class="[activeFab.class]" dark>
        <v-toolbar-side-icon></v-toolbar-side-icon>

        <v-toolbar-title>
            <router-link v-text="title" to="/"></router-link>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <div v-show="addingPhotosToGroup" class="title">{{ selectedGroups }} groups selected</div>
        <v-spacer></v-spacer>
        <v-toolbar-items>
            <v-btn flat
                   @click.stop="$store.commit('updateRightDrawer', true)"
                   class="mr-4 deep-purple ligthen-2"
            >
                Photo pool&nbsp;&nbsp;
                <v-icon v-badge="{ value: pool.length , overlap:true, class: 'red-lighten-3'}">filter
                </v-icon>
            </v-btn>
        </v-toolbar-items>
    </v-toolbar>
</template>
<script>
  import { mapGetters, mapState } from 'vuex'

  export default {
    name: 'Toolbar',
    data () {
      return {
        title: 'Layout'
      }
    },
    computed: {
      ...mapState([
        'pool',
        'selectedGroups'
      ]),
      ...mapGetters([
        'activeFab',
        'addingPhotosToGroup'
      ])
    }
  }
</script>