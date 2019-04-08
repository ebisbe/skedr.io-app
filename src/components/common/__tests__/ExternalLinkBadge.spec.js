import { mount } from '@vue/test-utils'
import Comp from '../ExternalLinkBadge'
import Vue from 'vue'
import Vuetify from 'vuetify'

Vue.use(Vuetify)

describe('ExternalLinkBadge component', () => {
  it('has a snapshot', () => {
    const wrapper = mount(Comp, {
      propsData: { hover: false, groupId: 'groupId' },
      slots: { default: 'Default icon text' }
    })
    expect(wrapper).toMatchSnapshot()
  })
})
