<template>
    <v-app id="e3" toolbar footer>
        <v-toolbar class="red" fixed>
            <v-toolbar-title>
                <v-toolbar-side-icon></v-toolbar-side-icon>
                Scheduler
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-text-field label="Search..." single-line append-icon="search" hide-details
            ></v-text-field>
            <v-btn slot="activator" class="purple" dark>Click me</v-btn>

        </v-toolbar>
        <main>
            <v-container grid-list-md>
                <v-layout wrapp row>
                    <v-flex xs9>
                        <router-view></router-view>
                    </v-flex>
                    <v-flex xs3>
                        <v-layout row wrap>
                            <v-flex>
                                <pool></pool>
                            </v-flex>

                            <v-flex>
                                <v-card dark class="primary">
                                    <scheduled-list></scheduled-list>
                                </v-card>

                            </v-flex>
                        </v-layout>
                    </v-flex>
                </v-layout>
            </v-container>

        </main>
        <pool-dialog></pool-dialog>
        <v-footer class="pa-3">
            <v-spacer></v-spacer>
            <div>© {{ new Date().getFullYear() }}</div>
        </v-footer>
    </v-app>
</template>

<script>
  import PoolDialog from './components/PoolDialog.vue'
  import Pool from './components/Pool.vue'
  import ScheduledList from './components/ScheduledList.vue'

  export default {
    name: 'app',
    components: {PoolDialog, Pool, ScheduledList},
    methods: {},
    data () {
      return {
      }
    }
  }
</script>
<style>
    body {
        overflow-x: hidden;
    }
</style>
