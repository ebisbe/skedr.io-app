import { shallowMount } from '@vue/test-utils'
import comp from '../QFilter.vue'
import Vue from 'vue'
import Vuetify from 'vuetify'

describe('QFilter.vue', () => {
  Vue.use(Vuetify)

  const createCmp = (propsData, stubs = { 'v-text-field': { methods: { focus: () => {} }, render: () => {} } }) =>
    shallowMount(comp, { propsData, stubs })

  describe('Properties', () => {
    it("has a placeholder property with default to 'Search'", () => {
      const wrapper = createCmp({ dontFocus: true })
      expect(wrapper.props().placeholder).toBe('Search')
    })
    it('has a dontFocus property with default to false', () => {
      const focus = jest.fn()
      const wrapper = createCmp({}, { 'v-text-field': { methods: { focus }, render: () => {} } })
      expect(focus).toHaveBeenCalledTimes(1)
    })
  })

  describe('Computed', () => {
    it('shows search icon', () => {
      const wrapper = createCmp()
      expect(wrapper.vm.icon).toBe('search')
    })

    it('shows clear icon', () => {
      const wrapper = createCmp()
      wrapper.setData({ search: 'text' })
      expect(wrapper.vm.icon).toBe('clear')
    })
  })

  describe('Watchers', () => {
    it("emits 'search' event while typing", () => {
      const wrapper = createCmp()
      wrapper.setData({ search: 'text' })
      wrapper.vm.clearText()
      expect(wrapper.emitted().search[0][0]).toBe('text')
    })
    it("emits '' event when value is null", () => {
      const wrapper = createCmp()
      wrapper.setData({ search: null })
      expect(wrapper.emitted().search[0][0]).toBe('')
      expect(wrapper.emitted().clear).toBeTruthy()
      wrapper.setData({ search: '' })
      expect(wrapper.emitted().search[1][0]).toBe('')
      expect(wrapper.emitted().clear).toBeTruthy()
    })
  })

  describe('Methods', () => {
    it("emits 'ctrlEnter' event", () => {
      const wrapper = createCmp()
      wrapper.vm.ctrlEnter()
      expect(wrapper.emitted().ctrlEnter).toEqual([[]])
    })

    it("emits 'ctrlEsc' event", () => {
      const wrapper = createCmp()
      wrapper.vm.ctrlEsc()
      expect(wrapper.emitted().ctrlEsc).toEqual([[]])
    })

    it("emits 'enter' event", () => {
      const wrapper = createCmp()
      wrapper.vm.search = 'group name'
      wrapper.vm.enter()

      expect(wrapper.emitted().enter[0][0]).toEqual('group name')
    })
  })
})
