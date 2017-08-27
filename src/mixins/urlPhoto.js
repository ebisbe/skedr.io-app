export const url = {
  methods: {
    urlPhoto (photo) {
      return 'https://farm' + photo.farm + '.staticflickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '_' + this.size + '.jpg'
    },
    urlGroup (group) {
      return 'http://farm' + group.iconfarm + '.staticflickr.com/' + group.iconserver + '/buddyicons/' + group.nsid + '.jpg'
    }
  }
}
