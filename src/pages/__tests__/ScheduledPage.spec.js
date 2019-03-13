import { mount } from '@vue/test-utils'
import Comp from '../ScheduledPage.vue'
import Vue from 'vue'
import Vuetify from 'vuetify'

Vue.use(Vuetify)

describe('ScheduledPage', () => {
  it('is loading', () => {
    const wrapper = mount(Comp, { mocks: { $apollo: { queries: { scheduledPhotos: { loading: true } } } } })
    expect(wrapper).toMatchSnapshot()
  })
  it('has an error', () => {
    const wrapper = mount(Comp, {
      mocks: { $apollo: { error: true, queries: { scheduledPhotos: { loading: false } } } }
    })
    expect(wrapper).toMatchSnapshot()
  })
  it('shows some results', () => {
    const wrapper = mount(Comp, {
      mocks: { $apollo: { error: false, queries: { scheduledPhotos: { loading: false } } } }
    })
    wrapper.setData({
      scheduledPhotos: [
        {
          scheduledAt: 1552532400,
          photo: {
            title: '2p71y2bsfyg21'
          },
          group: { title: 'enricbgtest' }
        },
        {
          scheduledAt: 1552532400,
          photo: {
            title: '2p71y2bsfyg21'
          },
          group: { title: 'enricbgtest2' }
        },
        {
          scheduledAt: 1552632400,
          photo: {
            title: '2p71y2bsfyg21'
          },
          group: { title: 'enricbgtest' }
        },
        {
          scheduledAt: 1552632400,
          photo: {
            title: '2p71y2bsfyg21'
          },
          group: { title: 'enricbgtest2' }
        }
      ]
    })
    expect(wrapper).toMatchSnapshot()
  })
})
