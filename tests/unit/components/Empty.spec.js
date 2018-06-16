import { createLocalVue, mount } from '@vue/test-utils'
import comp from '@/components/Empty.vue'
import Vuetify from 'vuetify'

describe('Empty.vue', () => {
  const localVue = createLocalVue()
  beforeEach(() => {
    localVue.use(Vuetify)
  })

  it('it shows error with custom error text', () => {
    const propsData = {
      error: true,
      description: 'Custom error text'
    }

    const wrapper = mount(comp, {
      localVue,
      propsData
    })
    expect(wrapper.text()).toContain('Custom error text')
  })

  it('it shows error with default error text', () => {
    const propsData = {
      error: true
    }

    const wrapper = mount(comp, {
      localVue,
      propsData
    })
    expect(wrapper.text()).toContain('Ups! Some error happened fetching your data...')
  })

  it('it shows message with text_icon', () => {
    const propsData = {
      description: 'Custom text',
      icon: 'some_icon'
    }

    const wrapper = mount(comp, {
      localVue,
      propsData
    })

    expect(wrapper.text()).toContain('Custom text')
    expect(wrapper.text()).toContain('some_icon')
  })

  it('it shows indeterminate loader', () => {
    const propsData = {
      loading: true,
      description: 'Custom text',
      icon: 'some_icon'
    }

    const wrapper = mount(comp, {
      localVue,
      propsData
    })

    expect(wrapper.text()).not.toContain('Custom text')
    expect(wrapper.text()).not.toContain('some_icon')
  })
})
