<script>
import debounce from 'lodash/debounce'
import { API } from 'aws-amplify'

export default {
  name: 'Fetch',
  props: {
    url: {
      type: String,
      default: ''
    },
    params: {
      type: Object,
      default: () => {}
    },
    data: {
      type: Object,
      default: () => {}
    },
    method: {
      type: String,
      default: 'get'
    }
  },
  data() {
    const res = {
      status: 'pending',
      data: null,
      error: null
    }

    let activePromise = null

    const fetchData = debounce(() => {
      if (!this.url) {
        res.status = 'waiting'
        return res
      }

      const currentPromise = (activePromise = API.post(process.env.API_NAME, this.url, {
        body: this.data,
        response: true
      }))

      res.status = 'pending'

      currentPromise
        .then(response => {
          if (activePromise !== currentPromise) {
            return
          }
          if (response.status >= 200 && response.status < 300) {
            return response.data
          } else {
            activePromise = null
            res.status = 'error'
            res.data = null
            res.error = response.status
          }
        })
        .then(data => {
          if (activePromise !== currentPromise) {
            return
          }
          activePromise = null
          res.status = 'success'
          res.data = data
          res.error = null
        })
        .catch(error => {
          if (activePromise !== currentPromise) {
            return
          }
          activePromise = null
          res.status = 'error'
          res.data = null
          res.error = error
        })
    }, 300)

    setTimeout(() => {
      this.$watch(() => this.url, fetchData, { immediate: true })
    }, 0)

    return { res }
  },

  render() {
    const res = this.$scopedSlots.default(this.res)
    return Array.isArray(res) ? res[0] : res
  }
}
</script>
