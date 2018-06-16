import { createLocalVue, mount } from '@vue/test-utils'
import QChip from '@/components/QChip.vue'
import Vuetify from 'vuetify'

describe('QChip.vue', () => {
  const localVue = createLocalVue()
  beforeEach(() => {
    localVue.use(Vuetify)
  })

  it('it renders a tag with 0%', () => {
    const tag = {
      value: 'Tag1',
      percentage: () => {
        return 0
      }
    }

    const wrapper = mount(QChip, {
      localVue: localVue,
      propsData: { tag }
    })
    expect(wrapper.text()).toContain('0%')
    expect(wrapper.text()).toContain('Tag1')
    expect(wrapper.find('div').classes().length).toBe(2)
    expect(wrapper.find('div').classes()).toContain('darken-2')
  })

  it('it renders a tag with 50%', () => {
    const tag = {
      value: 'Tag2',
      percentage: () => {
        return 50
      }
    }

    const wrapper = mount(QChip, {
      localVue: localVue,
      propsData: { tag }
    })
    expect(wrapper.text()).toContain('50%')
    expect(wrapper.text()).toContain('Tag2')
    expect(wrapper.find('div').classes().length).toBe(3)
    expect(wrapper.find('div').classes()).toContain('light-green')
  })

  it('it renders a tag with 76%', () => {
    const tag = {
      value: 'Tag3',
      percentage: () => {
        return 76
      }
    }

    const wrapper = mount(QChip, {
      localVue: localVue,
      propsData: { tag }
    })
    expect(wrapper.text()).toContain('76%')
    expect(wrapper.text()).toContain('Tag3')
    expect(wrapper.find('div').classes().length).toBe(3)
    expect(wrapper.find('div').classes()).toContain('green')
  })

  it('it selects a chip', () => {
    const tag = {
      value: 'Tag4',
      percentage: () => {
        return 25
      }
    }

    const wrapper = mount(QChip, {
      localVue: localVue,
      propsData: { tag }
    })

    expect(wrapper.vm.selected).toBe(false)
    wrapper.find('.chip__content').trigger('click')
    expect(wrapper.vm.selected).toBe(true)
    expect(wrapper.emitted().selectedTag[0][0]).toBe('Tag4')
  })
})
