<template>
    <b-card :title="photo.title"
            :img-src="urlPhoto"
            img-alt="photo.title"
            img-top
            tag="article"
            style="max-width: 20rem;"
            class="mb-2">
    </b-card>
</template>
<script>
  export default {
    props: ['photo', 'size'],
    methods: {
    },
    computed: {
      urlPhoto: function () {
        return 'https://farm' + this.photo.farm + '.staticflickr.com/' + this.photo.server + '/' + this.photo.id + '_' + this.photo.secret + '_' + this.size + '.jpg'
      },
      classAtt: function () {
        return 'image filtered ' + this.classSpan
      }
    }
  }
</script>