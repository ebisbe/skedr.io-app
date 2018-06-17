import { createLocalVue, shallowMount } from '@vue/test-utils'
import QChip from '@/components/QChip.vue'
import Vuetify from 'vuetify'

describe('QChip.vue', () => {
  const localVue = createLocalVue()
  beforeEach(() => {
    localVue.use(Vuetify)
  })

  const createCmp = propsData => shallowMount(QChip, { localVue, propsData })

  describe('Properties', () => {
    it('has a tag property', () => {
      const tag = {
        value: 'Tag1',
        percentage: () => {
          return 0
        }
      }

      const wrapper = createCmp({ tag })
      expect(wrapper.props().tag).toBe(tag)
    })
  })

  describe('Computed Properties', () => {
    it('it renders a colorless tag with 0%', () => {
      const tag = {
        percentage: () => {
          return 0
        }
      }

      const wrapper = createCmp({ tag })
      expect(wrapper.vm.percentageText).toBe('0%')
      expect(wrapper.vm.color).toBe(undefined)
    })

    it('it renders a colorless tag with 49%', () => {
      const tag = {
        percentage: () => {
          return 49
        }
      }

      const wrapper = createCmp({ tag })
      expect(wrapper.vm.color).toBe(undefined)
    })

    it('it renders a light-green tag with 50%', () => {
      let tag = {
        percentage: () => {
          return 50
        }
      }

      const wrapper = createCmp({ tag })
      expect(wrapper.vm.percentageText).toBe('50%')
      expect(wrapper.vm.color).toBe('light-green')
    })

    it('it renders a light-green tag with 75%', () => {
      const tag = {
        percentage: () => {
          return 75
        }
      }

      const wrapper = shallowMount(QChip, {
        localVue,
        propsData: { tag }
      })
      expect(wrapper.vm.color).toBe('light-green')
    })

    it('it renders a green tag with 76%', () => {
      const tag = {
        percentage: () => {
          return 76
        }
      }

      const wrapper = createCmp({ tag })
      expect(wrapper.vm.percentageText).toBe('76%')
      expect(wrapper.vm.color).toBe('green')
    })
  })

  describe('Events', () => {
    it('it selects a vuetify chip', () => {
      const tag = {
        value: 'Tag4',
        percentage: () => {
          return 25
        }
      }

      const wrapper = createCmp({ tag })
      expect(wrapper.vm.selected).toBe(false)
      wrapper.vm.select()
      expect(wrapper.vm.selected).toBe(true)
      expect(wrapper.emitted().selectedTag[0][0]).toBe('Tag4')
    })
  })
})
