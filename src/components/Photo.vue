<template>
    <!-- <a :href="urlPhoto" @click="trackEvent(photo.title)" :class="classAtt"
        data-position="bottom">-->
    <img :src="urlPhoto" :alt="photo.title" class="img-responsive"/>
    <!--</a>-->
</template>
<script>
  export default {
    props: ['photo', 'size'],
    methods: {
      trackEvent: function (name) {
        // this.$ua.trackEvent('gallery-photo', 'click', name)
      }
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