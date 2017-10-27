<template>
    <v-content>
        <v-container fluid grid-list-xl>
            <v-layout row wrap>
                <v-flex xs12>
                    <h2 class="display-1 ma-3">Scheduled photos</h2>
                    <scheduled-photos></scheduled-photos>
                </v-flex>
            </v-layout>
        </v-container>
    </v-content>
</template>
<script>
  import ScheduledPhotos from '../../components/ScheduledPhotos.vue'

  export default {
    name: 'Scheduled',
    components: {ScheduledPhotos}
  }
</script>