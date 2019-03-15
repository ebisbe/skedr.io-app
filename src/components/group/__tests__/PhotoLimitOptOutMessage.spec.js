import { shallowMount } from '@vue/test-utils'
import Vue from 'vue'
import Vuetify from 'vuetify'
import Comp from '../PhotoLimitOptOutMessage.vue'

Vue.use(Vuetify)

describe('PhotoLimitOptOutMessage', () => {
  it('shows the message', () => {
    const wrapper = shallowMount(Comp, { propsData: { optOut: false } })
    expect(wrapper).toMatchSnapshot()
  })
  it('does not show the message', () => {
    const wrapper = shallowMount(Comp, { propsData: { optOut: true } })
    expect(wrapper).toMatchSnapshot()
  })
})
