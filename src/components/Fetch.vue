<script>
  import _ from 'lodash'
  import aws41 from 'aws41'
  import AWS from 'aws-sdk'

  export default {
    name: 'fetch',
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
    data () {
      const res = {
        status: 'pending',
        data: null,
        error: null
      }

      let activePromise = null

      const fetchData = _.debounce(() => {
        if (!this.url) {
          res.status = 'waiting'
          return res
        }

        const currentPromise = activePromise = this.signReq()

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
        this.$watch(() => this.url, fetchData, {immediate: true})
      }, 0)

      return {res}
    },

    render () {
      const res = this.$scopedSlots.default(this.res)
      return Array.isArray(res) ? res[0] : res
    },

    methods: {
      signReq () {
        const path = this.url.replace('@', '%40')
        let request = {
          host: 'wqd87xurte.execute-api.eu-west-1.amazonaws.com',
          method: this.method.toUpperCase(),
          url: 'https://wqd87xurte.execute-api.eu-west-1.amazonaws.com/dev' + path,
          path: '/dev' + path,
          params: this.params,
          data: this.data,
          body: JSON.stringify(this.data)
        }

        if (this.method === 'post') {
          request.headers = {
            'content-type': 'application/json'
          }
        }

        let signedRequest = aws41.sign(request,
          {
            secretAccessKey: AWS.config.credentials.secretAccessKey,
            accessKeyId: AWS.config.credentials.accessKeyId,
            sessionToken: AWS.config.credentials.sessionToken
          })
        delete signedRequest.headers['Host']
        delete signedRequest.headers['Content-Length']

        return this.axios(signedRequest)
      }
    }
  }
</script>