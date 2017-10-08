export const url = {
  methods: {
    urlGroup (group) {
      return 'https://farm' + group.iconfarm + '.staticflickr.com/' + group.iconserver + '/buddyicons/' + group.nsid + '.jpg'
    },
    urlPhoto (photo) {
      return 'https://farm' + photo.farm + '.staticflickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '_' + this.size + '.jpg'
    }
  }
}
