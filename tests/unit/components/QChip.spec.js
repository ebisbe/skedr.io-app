import { createLocalVue, shallowMount } from '@vue/test-utils'
import QChip from '@/components/QChip.vue'
import Vuetify from 'vuetify'

describe('QChip.vue', () => {
  const localVue = createLocalVue()
  beforeEach(() => {
    localVue.use(Vuetify)
  })

  it('it renders a tag with 0%', () => {
    const tag = {
      percentage: () => {
        return 0
      }
    }

    const wrapper = shallowMount(QChip, {
      localVue,
      propsData: { tag }
    })
    expect(wrapper.vm.percentageText).toBe('0%')
    expect(wrapper.vm.color).toBe(undefined)
  })

  it('it renders a tag with 49%', () => {
    const tag = {
      percentage: () => {
        return 49
      }
    }

    const wrapper = shallowMount(QChip, {
      localVue,
      propsData: { tag }
    })
    expect(wrapper.vm.color).toBe(undefined)
  })

  it('it renders a tag with 50%', () => {
    let tag = {
      percentage: () => {
        return 50
      }
    }

    const wrapper = shallowMount(QChip, {
      localVue,
      propsData: { tag }
    })
    expect(wrapper.vm.percentageText).toBe('50%')
    expect(wrapper.vm.color).toBe('light-green')
  })

  it('it renders a tag with 75%', () => {
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

  it('it renders a tag with 76%', () => {
    const tag = {
      percentage: () => {
        return 76
      }
    }

    const wrapper = shallowMount(QChip, {
      localVue: localVue,
      propsData: { tag }
    })
    expect(wrapper.vm.percentageText).toBe('76%')
    expect(wrapper.vm.color).toBe('green')
  })

  it('it selects a chip', () => {
    const tag = {
      value: 'Tag4',
      percentage: () => {
        return 25
      }
    }

    const wrapper = shallowMount(QChip, {
      localVue,
      propsData: { tag }
    })

    expect(wrapper.vm.selected).toBe(false)
    wrapper.vm.select()
    expect(wrapper.vm.selected).toBe(true)
    expect(wrapper.emitted().selectedTag[0][0]).toBe('Tag4')
  })
})
