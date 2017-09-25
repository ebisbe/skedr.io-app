<template>
    <div>
        <h1>Scheduled photos</h1>
        <ul class="list-unstyled">
            <scheduled-media
                    v-for="photo in scheduled"
                    :key="photo.photoId"
                    :photo="photo"></scheduled-media>
        </ul>
    </div>
</template>
<script>
  import ScheduledMedia from './ScheduledMedia.vue'

  export default {
    name: 'Scheduled',
    components: {ScheduledMedia},
    props: ['scheduled']
  }
</script>