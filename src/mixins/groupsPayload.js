import { signReq } from '../libs/aws-lib'
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters(['userId'])
  },
  methods: {
    constructPayload(groups) {
      const requests = new Array()
      for (let group of groups) {
        for (let photo of this.pool) {
          let payload = {
            photoId: photo.photoId,
            userId: this.userId,
            groupId: group.groupId,
            secret: photo.secret
          }
          requests.push(signReq('pool', '', payload, 'post'))
        }
      }

      return requests
    }
  }
}
