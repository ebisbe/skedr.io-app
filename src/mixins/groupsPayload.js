import { mapGetters, mapState } from 'vuex'

export default {
  computed: {
    ...mapGetters({ userId: 'user/userId' }),
    ...mapState('pool', { pool: state => state.photos })
  },
  methods: {
    constructPayload(groups) {
      const requests = new Array()
      for (let group of groups) {
        for (let photo of this.pool) {
          let payload = {
            body: {
              photoId: photo.photoId,
              userId: this.userId,
              groupId: group.groupId
            }
          }
          requests.push({ path: '/pool', payload })
        }
      }

      return requests
    }
  }
}
