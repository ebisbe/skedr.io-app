import Moment from 'moment'

export default {
  computed: {
    scheduledAt() {
      return Moment()
        .startOf('day')
        .utc()
        .unix()
    }
  }
}
