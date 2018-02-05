export const url = {
  methods: {
    urlGroup({ iconfarm, iconserver, nsid }) {
      return `https://farm${iconfarm}.staticflickr.com/${iconserver}/buddyicons/${nsid}.jpg`
    },
    urlPhoto({ farm, server, id, secret }) {
      return `https://farm${farm}.staticflickr.com/${server}/${id}_${secret}_${this.size}.jpg`
    }
  }
}
