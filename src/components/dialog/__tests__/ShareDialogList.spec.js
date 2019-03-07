import { shallowMount } from '@vue/test-utils'
import comp from '../ShareDialogList.vue'
import Vue from 'vue'
import Vuetify from 'vuetify'

Vue.use(Vuetify)

const createCmp = propsData => shallowMount(comp, { propsData })
describe('ShareDialogList component', () => {
  describe('Computed properties', () => {
    it('is disabled', () => {
      const wrapper = createCmp({ group: { throttleMode: 'disabled' } })
      expect(wrapper.vm.disabled).toBe(true)
    })
    it('is not disabled', () => {
      const wrapper = createCmp({ group: { throttleMode: 'day' } })
      expect(wrapper.vm.disabled).toBe(false)
    })
    it('shows a green badge', () => {
      const wrapper = createCmp({ selected: true, group: {} })
      expect(wrapper.vm.badgeColor).toBe('success')
    })
    it('shows a grey badge', () => {
      const wrapper = createCmp({ selected: false, group: {} })
      expect(wrapper.vm.badgeColor).toBe('grey')
    })
    it('shows a CLEAR icon badge', () => {
      const wrapper = createCmp({ group: { throttleMode: 'disabled' } })
      expect(wrapper.vm.badgeType).toBe('clear')
    })
    it('shows a CHECK icon badge', () => {
      const wrapper = createCmp({ group: { throttleMode: 'day' } })
      expect(wrapper.vm.badgeType).toBe('check')
    })
    it('uses the badge when is selected', () => {
      const wrapper = createCmp({ selected: true, group: {} })
      expect(wrapper.vm.useBadge).toBe(true)
    })
    it('uses the badge when is disabled', () => {
      const wrapper = createCmp({ group: { throttleMode: 'disabled' } })
      expect(wrapper.vm.useBadge).toBe(true)
    })
    it('uses the badge when is alreadyInGroup', () => {
      const wrapper = createCmp({ alreadyInGroup: true, group: {} })
      expect(wrapper.vm.useBadge).toBe(true)
    })
    it('is clickable', () => {
      const wrapper = createCmp({ group: { throttleMode: 'day' } })
      expect(wrapper.vm.clickable).toBe(true)
    })
  })

  describe('Methods', () => {
    it('emits SELECT event', () => {
      const wrapper = createCmp({ group: {} })
      wrapper.vm.selectGroup()
      expect(wrapper.emitted().select).toBeTruthy()
    })
    it('emits REMOVE event', () => {
      const wrapper = createCmp({ group: {}, selected: true })
      wrapper.vm.selectGroup()
      expect(wrapper.emitted().remove).toBeTruthy()
    })
  })
})
