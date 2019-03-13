import { shallowMount } from '@vue/test-utils'
import Vue from 'vue'
import Vuetify from 'vuetify'
import Comp from '../BasePhoto.vue'

Vue.use(Vuetify)

describe('BasePhoto component', () => {
  it('prints base component', () => {
    const wrapper = shallowMount(Comp, {
      propsData: { url: 'url1', lazyUrl: 'lazyUrl', isPrivate: true },
      slots: { header: '<span>header slot</span>', footer: '<span>footer slot</span>' }
    })
    expect(wrapper).toMatchSnapshot()
  })
})
