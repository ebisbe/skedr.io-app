import AppFetch from './AppFetch.vue'

export default {
  component: { AppFetch },
  functional: true,
  render(h, ctx) {
    return h(AppFetch, {
      props: {
        url: ctx.props.url,
        method: ctx.props.method,
        data: ctx.props.data,
        params: ctx.props.params
      },
      scopedSlots: {
        default: ({ status, data, error }) => {
          if (status === 'error') {
            return h('div', error)
          } else if (status === 'pending') {
            return h('v-progress-linear', {
              props: { indeterminate: true, height: 3 }
            })
          } else if (status === 'waiting') {
            return ''
          } else {
            return ctx.data.scopedSlots.default(data)
          }
        }
      }
    })
  }
}
