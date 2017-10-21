import Fetch from './Fetch.vue'

export default {
  name: 'MyFetch',
  component: {Fetch},
  functional: true,
  render (h, ctx) {
    return h(Fetch, {
      props: {url: ctx.props.url},
      scopedSlots: {
        default: ({status, data, error}) => {
          if (status === 'error') {
            return h('div', error)
          } else if (status === 'pending') {
            return h('v-progress-linear', {props: {indeterminate: true, height: 3}})
          } else {
            return ctx.data.scopedSlots.default(data)
          }
        }
      }
    })
  }
}
