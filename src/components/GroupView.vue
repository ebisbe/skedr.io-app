<template>
    <section class="content">
        <div class="row" v-if="group">
            <h1 v-html="title"></h1>
            <p v-html="group.description._content"></p>
        </div>
        <div class="row" v-if="relatedPhotos">
            <photo
                    v-for="photo in relatedPhotos.photo"
                    :photo="photo"
                    size="n"
                    :key="photo.nsid"
            ></photo>
        </div>
    </section>
</template>
<script>
  import Photo from './Photo.vue'

  export default {
    name: 'GroupView',
    components: {Photo},
    data () {
      return {
        group: null,
        relatedPhotos: null
      }
    },
    watch: {
      // call again the method if the route changes
      '$route': 'fetchData'
    },
    created () {
      this.fetchData()
    },
    methods: {
      fetchData: function () {
        this.axios
          .get('groups/' + this.$route.params.group_id)
          .then((response) => {
            this.group = response.data
          })
          .catch(function (error) {
            console.log(error)
          })
        this.axios
          .get('groups/pool/' + this.$route.params.group_id)
          .then((response) => {
            this.relatedPhotos = response.data
          })
          .catch(function (error) {
            console.log(error)
          })
      }
    },
    computed: {
      title: function () {
        return this.group.name._content + ' ' + this.group.throttle.remaining + '/' + this.group.throttle.count
      }
    }
  }
</script>