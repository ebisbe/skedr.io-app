import { shallowMount } from '@vue/test-utils'
import Vue from 'vue'
import Vuetify from 'vuetify'
import Comp from '../BasePhoto.vue'

Vue.use(Vuetify)

const createCmp = propsData => shallowMount(Comp, { propsData })

describe('BasePhoto component', () => {
  it('prints base component', () => {
    const wrapper = shallowMount(Comp, {
      propsData: { url: 'url1', lazyUrl: 'lazyUrl', isPrivate: true },
      slots: { header: '<span>header slot</span>', footer: '<span>footer slot</span>' }
    })
    expect(wrapper).toMatchSnapshot()
  })

  it('hides urlM when the component is not visible', () => {
    const wrapper = createCmp({ url: '', lazyUrl: '' })
    expect(wrapper.vm.bigImg).toBe('')
  })

  it('prints urlM when the component is visible', () => {
    const wrapper = createCmp({ url: 'urlM', lazyUrl: '' })
    wrapper.vm.showObserver = false
    expect(wrapper.vm.bigImg).toBe('urlM')
  })

  it('returns full image height when photo is not selected', () => {
    const wrapper = createCmp({ url: 'myId', lazyUrl: '' })
    expect(wrapper.vm.realHeight).toBe(250)
  })

  it('returns less height of the image when photo is selected', () => {
    const wrapper = createCmp({ url: '', lazyUrl: '', isSelected: true })
    expect(wrapper.vm.realHeight).toBe(226)
  })
})
