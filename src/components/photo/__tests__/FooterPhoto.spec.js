import { shallowMount } from '@vue/test-utils'
import Vue from 'vue'
import Vuetify from 'vuetify'
import Comp from '../FooterPhoto.vue'

Vue.use(Vuetify)

describe('FooterPhoto', () => {
  it('renders title and subtitle properties', () => {
    const wrapper = shallowMount(Comp, { propsData: { title: 'My title', subtitle: 'My subtitle' } })
    expect(wrapper).toMatchSnapshot()
  })

  it('renders title and subtitle slots', () => {
    const wrapper = shallowMount(Comp, {
      slots: { title: '<span>Slot title</span>', subtitle: '<span>Slot subtitle</span>', action: '<span>Slot action</span>' }
    })
    expect(wrapper).toMatchSnapshot()
  })
})
