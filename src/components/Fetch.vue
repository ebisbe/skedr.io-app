<script>
  import _ from 'lodash'

  export default {
    name: 'fetch',
    props: {
      url: {
        type: String,
        required: true
      }
    },
    data () {
      const res = {
        status: 'pending',
        data: null,
        error: null
      }

      let activePromise = null

      const fetchData = _.debounce(url => {
        if (!url) {
          return
        }

        const currentPromise = activePromise = fetch(url)
        res.status = 'pending'

        currentPromise.then(response => {
          if (activePromise !== currentPromise) {
            return
          }
          if (response.status >= 200 && response.status < 300) {
            return response.json()
          } else {
            activePromise = null
            res.status = 'error'
            res.data = null
            res.error = response.status
          }
        }).then(data => {
          if (activePromise !== currentPromise) {
            return
          }
          activePromise = null
          res.status = 'success'
          res.data = data
          res.error = null
        }).catch(error => {
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
        this.$watch(() => this.url, fetchData, {immediate: true})
      }, 0)

      return {res}
    },

    render () {
      const res = this.$scopedSlots.default(this.res)
      return Array.isArray(res) ? res[0] : res
    }
  }
</script>