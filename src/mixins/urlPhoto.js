export const urlPhoto = {
  methods: {
    urlPhoto (photo) {
      return 'https://farm' + photo.farm + '.staticflickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '_' + this.size + '.jpg'
    }
  }
}
