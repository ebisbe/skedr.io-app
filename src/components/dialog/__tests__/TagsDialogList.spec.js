import { mount } from '@vue/test-utils'
import comp from '../TagsDialogList'
import Vue from 'vue'
import Vuetify from 'vuetify'
import Tag from '@/classes/Tag'

describe('TagsDialogList.vue', () => {
  Vue.use(Vuetify)

  const createCmp = propsData => mount(comp, { propsData })

  describe('Properties', () => {
    it('accepts Tag Class', () => {
      const tag = new Tag('a')
      const wrapper = createCmp({ tag })
      expect(wrapper.props().tag).toBe(tag)
    })
  })

  describe('Computed', () => {
    it('renders full star at 85% or more', () => {
      const tag = new Tag('a', 85, 100)
      const wrapper = createCmp({ tag })
      expect(wrapper.vm.icon).toBe('star')
    })

    it('renders half star at 84%', () => {
      const tag = new Tag('a', 84, 100)
      const wrapper = createCmp({ tag })
      expect(wrapper.vm.icon).toBe('star_half')
    })

    it('renders half star at 50%', () => {
      const tag = new Tag('a', 50, 100)
      const wrapper = createCmp({ tag })
      expect(wrapper.vm.icon).toBe('star_half')
    })

    it('renders empty star with 49% or less', () => {
      const tag = new Tag('a', 49, 100)
      const wrapper = createCmp({ tag })
      expect(wrapper.vm.icon).toBe('star_border')
    })
  })

  describe('Methods', () => {
    it('selectcs a tag', () => {
      const tag = new Tag('a')
      const wrapper = createCmp({ tag })
      expect(wrapper.props().tag.selected).toBeFalsy()
      wrapper.vm.select()
      expect(wrapper.props().tag.selected).toBeTruthy()
    })

    it('clicks the whole div', () => {
      const tag = new Tag('a')
      const wrapper = mount(comp, { propsData: { tag } })
      wrapper.find('div').trigger('click')
      expect(wrapper.props().tag.selected).toBeTruthy()
    })
  })
})
