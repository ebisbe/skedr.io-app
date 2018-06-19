import { createLocalVue, shallowMount } from '@vue/test-utils'
import QChip from '@/components/QChip.vue'
import Vuetify from 'vuetify'
import Tag from '@/classes/Tag'

describe('QChip.vue', () => {
  const localVue = createLocalVue()
  localVue.use(Vuetify)

  const createCmp = propsData => shallowMount(QChip, { localVue, propsData })

  describe('Properties', () => {
    it('has a tag property', () => {
      const tag = new Tag('a')

      const wrapper = createCmp({ tag })
      expect(wrapper.props().tag).toBe(tag)
    })
  })

  describe('Computed Properties', () => {
    it('it renders a colorless tag with 0%', () => {
      const tag = new Tag('a')

      const wrapper = createCmp({ tag })
      expect(wrapper.vm.percentageText).toBe('0%')
      expect(wrapper.vm.color).toBe(undefined)
    })

    it('it renders a colorless tag with 49%', () => {
      const tag = new Tag('a', 49, 100)

      const wrapper = createCmp({ tag })
      expect(wrapper.vm.color).toBe(undefined)
    })

    it('it renders a light-green tag with 50%', () => {
      let tag = new Tag('a', 50, 100)

      const wrapper = createCmp({ tag })
      expect(wrapper.vm.percentageText).toBe('50%')
      expect(wrapper.vm.color).toBe('light-green')
    })

    it('it renders a light-green tag with 75%', () => {
      const tag = new Tag('a', 75, 100)

      const wrapper = shallowMount(QChip, {
        localVue,
        propsData: { tag }
      })
      expect(wrapper.vm.color).toBe('light-green')
    })

    it('it renders a green tag with 76%', () => {
      const tag = new Tag('a', 76, 100)

      const wrapper = createCmp({ tag })
      expect(wrapper.vm.percentageText).toBe('76%')
      expect(wrapper.vm.color).toBe('green')
    })
  })

  describe('Events', () => {
    it('it selects a vuetify chip', () => {
      const tag = new Tag('Tag4')

      const wrapper = createCmp({ tag })
      expect(wrapper.props().tag.selected).toBe(false)
      wrapper.vm.select()
      expect(wrapper.props().tag.selected).toBe(true)
      expect(wrapper.emitted().selectedTag[0][0]).toBe('Tag4')
    })
  })
})
